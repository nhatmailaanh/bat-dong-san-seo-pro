import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variables
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error('API_KEY environment variable is not set');
      return res.status(500).json({ error: 'API Key not configured on server' });
    }

    const data = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Initialize Gemini AI with API key
    const genAI = new GoogleGenerativeAI({ apiKey: apiKey });

    const prompt = `
Bạn là chuyên gia viết content bất động sản chuyên nghiệp. Hãy tạo nội dung SEO cao cấp cho tin đăng bất động sản dựa trên thông tin sau:

Loại hình: ${data.type}
Diện tích: ${data.area}
Giá: ${data.price}
Vị trí: ${data.location}
Dự án (nếu có): ${data.project}
Tiện ích: ${data.amenities}
Pháp lý: ${data.legal}
Liên hệ: ${data.contact}

Hãy tạo:
1. 3 hook titles (tiêu đề gây chú ý)
2. 1 mô tả hot (mô tả nóng hấp dẫn khách hàng)
3. 5 highlight points chính (các điểm nổi bật)
4. SEO keywords (danh sách từ khóa SEO)

Trả lời dưới dạng JSON theo định dạng sau:
{
  "hookTitles": [{"title": "...", "keywords": [...]}, ...],
  "hotDescription": "...",
  "highlights": [{"title": "...", "description": "..."}, ...],
  "seoKeywords": [...]
}`;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Call Gemini API
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseType: 'application/json',
        temperature: 0.7,
      },
    });

    // Extract the response text
    const responseText = response.response.text();
    
    // Parse the JSON response
    const result = JSON.parse(responseText);

    // Return the result
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    
    return res.status(500).json({
      error: error.message || 'Internal server error',
      details: error.toString(),
    });
  }
}
