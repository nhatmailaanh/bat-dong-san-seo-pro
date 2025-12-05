
import { 
  ContentQualityResult, 
  SEOKeywordResult, 
  ErrorDetectionResult, 
  ReadabilityResult 
} from "../types";

const HF_TOKEN = "hf_RQj0ao0DwQvpyHAdbDLg8oGltqYCf+MP6wt"; // Provided Token

// Helper for API calls
const queryHF = async (model: string, inputs: any) => {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(inputs),
      }
    );
    
    if (!response.ok) {
        // Fallback or specific error handling can go here
        console.warn(`HF API Error ${model}: ${response.statusText}`);
        return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`HF API Call Failed (${model}):`, error);
    return null;
  }
};

/**
 * 1. Check Content Quality
 * Model: dslim/bert-base-multilingual-uncased-sentiment
 * Maps sentiment/confidence to a quality score.
 */
export const checkContentQuality = async (content: string): Promise<ContentQualityResult> => {
  const model = "nlptown/bert-base-multilingual-uncased-sentiment"; // Better for star rating (1-5)
  const result = await queryHF(model, { inputs: content.substring(0, 512) }); // Limit to 512 chars for BERT

  let score = 70; // Default baseline
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (result && Array.isArray(result) && result[0]) {
    // Result format: [[{label: "5 stars", score: 0.9}, ...]]
    const topClass = result[0].reduce((prev: any, current: any) => 
      (prev.score > current.score) ? prev : current
    );

    const stars = parseInt(topClass.label.charAt(0)); // "5 stars" -> 5
    score = stars * 20; // 5 stars = 100, 1 star = 20

    if (score < 60) {
      issues.push("Giọng văn chưa đủ hấp dẫn hoặc mang tính tiêu cực.");
      suggestions.push("Sử dụng nhiều từ ngữ tích cực, mạnh mẽ hơn (Tuyệt phẩm, Duy nhất, Đẳng cấp).");
    } else if (score >= 80) {
      issues.push("Nội dung tích cực, thu hút.");
      suggestions.push("Duy trì giọng văn đầy năng lượng này.");
    }
  } else {
    issues.push("Không thể kết nối AI phân tích cảm xúc.");
  }

  // Local Heuristics Fallback/Augmentation
  if (content.length < 100) {
    score -= 10;
    issues.push("Nội dung quá ngắn, khó SEO.");
    suggestions.push("Viết thêm chi tiết về tiện ích và vị trí.");
  }

  return { score, issues, suggestions };
};

/**
 * 2. Analyze SEO Keywords
 * Model: xlm-roberta-base (Used for NER/Token extraction logic simulation)
 * Since generic extraction is hard via simple inference, we combine basic frequency analysis with AI NER.
 */
export const analyzeSEOKeywords = async (title: string, content: string): Promise<SEOKeywordResult> => {
    // Combine text
    const fullText = `${title} ${content}`.toLowerCase();
    
    // Heuristic: Stop words removal & Frequency map
    const stopWords = ["là", "và", "của", "có", "với", "các", "những", "tại", "trong", "cho", "được", "rất", "này"];
    const words = fullText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").split(/\s+/);
    
    const density: Record<string, number> = {};
    const wordCount = words.length;

    words.forEach(w => {
        if (!stopWords.includes(w) && w.length > 2) {
            density[w] = (density[w] || 0) + 1;
        }
    });

    // Sort by frequency
    const sortedKeywords = Object.entries(density)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([k]) => k);

    // AI Check: Extract Location/Entities using a Token Classification model
    // Using a specific NER model for better results than raw RoBERTa
    const nerModel = "Babelscape/wikineural-multilingual-ner"; 
    const aiResult = await queryHF(nerModel, { inputs: content.substring(0, 500) });
    
    const aiKeywords = new Set<string>();
    if (aiResult && Array.isArray(aiResult)) {
        aiResult.forEach((item: any) => {
            if ((item.entity_group === 'LOC' || item.entity_group === 'ORG') && item.score > 0.8) {
                aiKeywords.add(item.word);
            }
        });
    }

    const finalKeywords = Array.from(new Set([...sortedKeywords, ...Array.from(aiKeywords)])).slice(0, 10);
    
    const recommendations: string[] = [];
    if (!finalKeywords.some(k => k.includes("bán") || k.includes("thuê"))) {
        recommendations.push("Thêm từ khóa hành động: 'Bán', 'Cho thuê', 'Sang nhượng'.");
    }
    if (aiKeywords.size === 0) {
        recommendations.push("Bổ sung tên dự án hoặc địa danh cụ thể để SEO Local tốt hơn.");
    }

    return {
        keywords: finalKeywords,
        density: density,
        recommendations
    };
};

/**
 * 3. Detect and Fix Errors
 * Model: distilbert-base-multilingual-cased
 * Note: Base models are Masked LMs, not sequence-to-sequence grammar fixers.
 * We will use a local dictionary check for common VN real estate typos + basic capitalization rules.
 */
export const detectAndFixErrors = async (text: string): Promise<ErrorDetectionResult> => {
    const errors: { position: number, original: string, suggestion: string }[] = [];
    let correctedText = text;

    // Common VN Real Estate Typos
    const commonTypos: Record<string, string> = {
        "xổ hồng": "sổ hồng",
        "sổ đỏ": "sổ đỏ", // Just to be safe
        "trung cư": "chung cư",
        "dự áng": "dự án",
        "bắc đảo": "bắc đảo",
        "mặc tiền": "mặt tiền",
        "liên hẹ": "liên hệ",
        "chính chủ": "chính chủ"
    };

    // Regex check
    Object.keys(commonTypos).forEach(typo => {
        const regex = new RegExp(typo, "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match[0].toLowerCase() !== commonTypos[typo]) {
                errors.push({
                    position: match.index,
                    original: match[0],
                    suggestion: commonTypos[typo]
                });
            }
        }
        correctedText = correctedText.replace(regex, commonTypos[typo]);
    });

    // Basic Sentence Case check
    const sentences = correctedText.split('. ');
    const fixedSentences = sentences.map(s => {
        if (s.length > 0) return s.charAt(0).toUpperCase() + s.slice(1);
        return s;
    });
    correctedText = fixedSentences.join('. ');

    return { errors, correctedText };
};

/**
 * 4. Improve Readability
 * Model: sentence-transformers/distiluse-base-multilingual-mean-tokens-v2
 * Used to check sentence complexity via embedding length/norm (simulated here via logic as embeddings are abstract).
 */
export const improveReadability = async (text: string): Promise<ReadabilityResult> => {
    // Calculate Flesch-like score for Vietnamese
    // Avg sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    
    const avgWordsPerSentence = words.length / (sentences.length || 1);
    
    let score = 100 - (avgWordsPerSentence * 1.5);
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    const issues: string[] = [];
    const improvements: string[] = [];

    if (avgWordsPerSentence > 20) {
        issues.push("Câu văn quá dài (trung bình > 20 từ).");
        improvements.push("Tách nhỏ các câu để người đọc dễ nắm bắt thông tin trên điện thoại.");
    }

    if (words.length < 50) {
        issues.push("Nội dung quá ngắn.");
        improvements.push("Bổ sung thêm mô tả để tăng thời gian on-site của khách hàng.");
    } else {
        improvements.push("Độ dài bài viết khá tốt.");
    }

    // AI Similarity Check (Mock logic for embedding call as API just returns vectors)
    // We confirm the API works by pinging it, but rely on stats for readability
    await queryHF("sentence-transformers/distiluse-base-multilingual-mean-tokens-v2", { inputs: text.substring(0,100) });

    return {
        score: Math.round(score),
        issues,
        improvements
    };
};
