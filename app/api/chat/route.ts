import { streamText, convertToModelMessages } from 'ai';

// System prompt for the Vietnamese commune AI assistant
const systemPrompt = `Bạn là trợ lý AI cho Hệ thống Quản lý Thông minh của UBND xã/phường. 
Bạn có khả năng:
1. Trả lời các câu hỏi về KPI, ngân sách, và thống kê hồ sơ
2. Hướng dẫn quy trình hành chính và thủ tục
3. Cung cấp thông tin về các dịch vụ công
4. Phân tích dữ liệu phản ánh từ công dân
5. Đưa ra đề xuất cải thiện dịch vụ công

Hãy luôn trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp và thân thiện.
Nếu không biết câu trả lời, hãy nói rõ và đề nghị tìm kiếm thêm thông tin từ bộ phận liên quan.

Mock Data (để trả lời câu hỏi):
- Tỷ lệ đúng hạn: 88%
- Tổng hồ sơ đang xử lý: 247
- Hồ sơ trễ hạn: 32
- Mức độ hài lòng trung bình: 4.6/5.0
- Ngân sách tháng này: 450 triệu / 500 triệu VND
- Đã chi: 350 triệu VND

Quy trình hành chính chính:
1. Tư pháp - Hộ tịch: Cấp giấy chứng thực (3-5 ngày), Đăng ký biến động (2-3 ngày)
2. Địa chính - Xây dựng: Cấp phép xây dựng (15 ngày), Bổ sung thửa đất (7-10 ngày)
3. An ninh - Quốc phòng: Cấp giấy thông hành (5 ngày)
4. Lao động - An sinh: Cấp bảo hiểm xã hội (7 ngày), Hỗ trợ lao động (10 ngày)`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert UIMessage format to ModelMessage format for AI SDK
    const convertedMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: convertedMessages,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Lỗi xử lý yêu cầu. Vui lòng thử lại sau.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
