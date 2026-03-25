import { streamText, convertToModelMessages } from 'ai';
import { ALERT_RISK_LABELS, getAssistantQuickStats, getLeaderSignalSnapshot } from '@/lib/frontend-dss';

function buildSystemPrompt() {
  const stats = getAssistantQuickStats();
  const leaderSignals = getLeaderSignalSnapshot();
  const riskVocabulary = `${ALERT_RISK_LABELS.critical}, ${ALERT_RISK_LABELS.warning}, ${ALERT_RISK_LABELS.info}, ${ALERT_RISK_LABELS.safe}`;

  return `Bạn là trợ lý AI cho Hệ thống Quản lý Thông minh của UBND xã/phường.
Bạn có khả năng:
1. Trả lời các câu hỏi về KPI, ngân sách, và thống kê hồ sơ
2. Hướng dẫn quy trình hành chính và thủ tục
3. Cung cấp thông tin về các dịch vụ công
4. Phân tích dữ liệu phản ánh từ công dân
5. Đưa ra đề xuất cải thiện dịch vụ công

Hãy luôn trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp và thân thiện.
Nếu không biết câu trả lời, hãy nói rõ và đề nghị kiểm tra thêm từ bộ phận chuyên môn.

Dữ liệu dashboard hiện có:
- Tỷ lệ đúng hạn: ${stats.tyLeDungHan}%
- Tổng hồ sơ đang xử lý: ${stats.tongHoSoDangXuLy}
- Hồ sơ trễ hạn: ${stats.hoSoTreHan}
- Tổng cảnh báo: ${stats.tongCanhBao}
- Cảnh báo nghiêm trọng: ${stats.canhBaoNghiemTrong}
- Dự báo thu tháng tới: ${stats.duBaoThuThangToi} triệu VND
- Dự báo chi tháng tới: ${stats.duBaoChiThangToi} triệu VND
- Độ tin cậy dự báo tổng hợp: ${leaderSignals.doTinCayDuBao}%
- Điểm rủi ro hiện tại (thang 0-100): ${leaderSignals.tongRuiRoHienTai}

Thuật ngữ cảnh báo chuẩn hóa trên dashboard và trợ lý:
- Mức độ rủi ro: ${riskVocabulary}
- Ưu tiên diễn giải theo thứ tự: ${ALERT_RISK_LABELS.critical} > ${ALERT_RISK_LABELS.warning} > ${ALERT_RISK_LABELS.info}

Quy trình hành chính chính:
1. Tư pháp - Hộ tịch: Cấp giấy chứng thực (3-5 ngày), Đăng ký biến động (2-3 ngày)
2. Địa chính - Xây dựng: Cấp phép xây dựng (15 ngày), Bổ sung thửa đất (7-10 ngày)
3. An ninh - Quốc phòng: Cấp giấy thông hành (5 ngày)
4. Lao động - An sinh: Cấp bảo hiểm xã hội (7 ngày), Hỗ trợ lao động (10 ngày)`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert UIMessage format to ModelMessage format for AI SDK
    const convertedMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: buildSystemPrompt(),
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
