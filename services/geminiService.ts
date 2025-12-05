import { GoogleGenAI, Type } from "@google/genai";
import { PropertyData, GeneratedContent } from "../types";

const parseJSON = (text: string): any => {
  try {
    // Attempt to clean markdown code blocks if present
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return null;
  }
};

export const generateRealEstateContent = async (data: PropertyData): Promise<GeneratedContent> => {
  // 1. Initialize API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 2. Construct Prompt
  const prompt = `
    Đóng vai là một chuyên gia Môi giới và Marketing Bất Động Sản hàng đầu tại Việt Nam (Top Seller trên batdongsan.com.vn).
    
    Nhiệm vụ 1: Phân tích chiến lược.
    Dựa trên kinh nghiệm thực tế từ các tin đăng VIP/Nổi bật trên batdongsan.com.vn, hãy đưa ra 3-4 điểm phân tích quan trọng về cách viết tin hiệu quả cho loại hình bất động sản này (cấu trúc, từ khóa, tâm lý khách hàng).

    Nhiệm vụ 2: Tối ưu hóa tin đăng bán/cho thuê dựa trên thông tin sau:
    - Loại hình: ${data.type}
    - Diện tích: ${data.area}
    - Giá: ${data.price}
    - Vị trí: ${data.location}
    - Dự án: ${data.project}
    - Tiện ích: ${data.amenities}
    - Pháp lý: ${data.legal}
    - Liên hệ: ${data.contact}

    Nhiệm vụ 3: Tạo nội dung chi tiết và trả về JSON:
    1. "marketAnalysis": 3-4 gạch đầu dòng phân tích chiến lược đăng tin như đã yêu cầu ở Nhiệm vụ 1.
    2. "hookTitles": Tạo chính xác 10 tiêu đề (Hook Titles) KHÔNG TRÙNG NHAU, mỗi tiêu đề áp dụng một chiến lược marketing cụ thể sau:
        - Chiến lược 1: Price-First (Nhấn mạnh giá rẻ, cắt lỗ, ưu đãi).
        - Chiến lược 2: Location-First (Nhấn mạnh vị trí đắc địa, kết nối).
        - Chiến lược 3: Urgency (Tạo sự khan hiếm, gấp gáp).
        - Chiến lược 4: Luxury (Nhấn mạnh sự sang trọng, đẳng cấp).
        - Chiến lược 5: Investment (Góc độ đầu tư sinh lời, dòng tiền).
        - Chiến lược 6: Family-Focused (Góc độ an cư, tiện ích cho gia đình/trẻ em).
        - Chiến lược 7: Modern-Living (Phong cách sống hiện đại, tiện nghi).
        - Chiến lược 8: Sustainability (Sống xanh, thoáng mát, gần thiên nhiên).
        - Chiến lược 9: Smart/Tech/Convenience (Full nội thất, xách vali vào ở).
        - Chiến lược 10: Lifestyle (Đánh vào cảm xúc và phong cách sống thượng lưu).
    3. "titleErrors": Cảnh báo nếu thiếu thông tin quan trọng.
    4. "fbContent": Nội dung Facebook ngắn (<200 ký tự).
    5. "keywords": 10-15 từ khóa SEO.
    6. "metaDescription": Meta description chuẩn SEO (<160 ký tự).
    7. "hotDescription": Mô tả "ĐÃO MỘA" (~200 từ) dùng nhiều emoji (🔥⚡💎🎁🏆✨💰🚀👑💯🎯⭐).
    8. "bestTemplate": Mẫu tin hoàn chỉnh tốt nhất kèm lý do.
    9. "postingSteps": Hướng dẫn đăng tin step-by-step.
  `;

  // 3. Define Schema using Type enum
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      marketAnalysis: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Phân tích chiến lược đăng tin từ batdongsan.com.vn",
      },
      hookTitles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING, description: "Tên chiến lược (VD: Price-First)" },
            title: { type: Type.STRING, description: "Tiêu đề tương ứng" }
          },
          required: ["strategy", "title"]
        },
        description: "10 biến thể tiêu đề theo 10 chiến lược khác nhau",
      },
      titleErrors: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      fbContent: { type: Type.STRING },
      keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      metaDescription: { type: Type.STRING },
      hotDescription: { type: Type.STRING },
      bestTemplate: {
        type: Type.OBJECT,
        properties: {
          rationale: { type: Type.STRING },
          finalContent: { type: Type.STRING },
        },
        required: ["rationale", "finalContent"],
      },
      postingSteps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      "marketAnalysis",
      "hookTitles",
      "titleErrors",
      "fbContent",
      "keywords",
      "metaDescription",
      "hotDescription",
      "bestTemplate",
      "postingSteps",
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, // Slightly higher for diverse creative titles
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = parseJSON(text);
    if (!json) throw new Error("Invalid JSON response");

    return json as GeneratedContent;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};