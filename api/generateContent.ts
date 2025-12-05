import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.API_KEY;
    console.log('API_KEY exists:', !!apiKey);

    if (!apiKey) {
      res.status(500).json({ error: 'API Key not configured on server' });
      return;
    }

    const data = req.body;
    console.log('Received data:', { type: data.type, area: data.area });

    const genAI = new GoogleGenerativeAI({ apiKey });

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

    const responseText = response.response.text();
    const result = JSON.parse(responseText);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: error.toString(),
    });
  }
}
