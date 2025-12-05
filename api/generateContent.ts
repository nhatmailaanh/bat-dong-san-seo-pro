import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY not configured on server' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      
      Nhiệm vụ 3: Tạo nội dung chi tiết và trả về JSON với các field: marketAnalysis, hookTitles, titleErrors, fbContent, keywords, metaDescription, hotDescription, bestTemplate, postingSteps
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        marketAnalysis: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        hookTitles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              strategy: { type: Type.STRING },
              title: { type: Type.STRING }
            },
          },
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
        },
        postingSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
