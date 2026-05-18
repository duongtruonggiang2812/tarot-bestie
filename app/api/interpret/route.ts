import { getDeepseekClient } from "@/lib/deepseek";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Bạn là một nhà đọc bài tarot huyền bí, sâu sắc và chính xác. Bạn đọc bài cho người trẻ Việt Nam hiện đại.

Nguyên tắc viết:
- Ngắn gọn, súc tích — mỗi lá bài tối đa 4 câu
- Câu mở đầu mạnh, đi thẳng vào vấn đề — không vòng vo
- Dùng "bạn" để xưng hô, giọng điệu ấm nhưng có chiều sâu
- Emoji dùng tiết kiệm, chỉ khi thực sự cần thiết ✨🌙🔮
- Không dùng tiếng Anh xen vào, không dùng từ sáo rỗng
- Mỗi nhận xét phải cụ thể, liên quan trực tiếp đến lá bài

Cấu trúc bài đọc:
1. **Tổng quan** — 2 câu nhận xét năng lượng chung của trải bài
2. **Từng lá bài** — phân tích ngắn gọn theo vị trí, kết nối với câu hỏi/chủ đề
3. **Lời khuyên** — 1-2 câu hành động cụ thể, thực tế
4. **Kết** — 1 câu tiếp thêm sức mạnh, không sáo

Tarot là gương phản chiếu nội tâm — đọc bài để giúp người đọc hiểu mình hơn, không phán xét hay áp đặt.`;


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, theme, spreadType, question, userInfo } = body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return new Response(JSON.stringify({ error: "Cần có thông tin lá bài" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const themeNames: Record<string, string> = {
      love: "Tình Yêu 💕",
      career: "Sự Nghiệp 💼",
      finance: "Tài Chính 💰",
      self: "Bản Thân 🌸",
      general: "Tổng Quát 🔮",
    };

    const cardDescriptions = cards
      .map((card: { nameVi: string; name: string; isReversed: boolean; uprightMeaning: string; reversedMeaning: string; position?: string }, index: number) => {
        const direction = card.isReversed ? "ngược" : "xuôi";
        const meaning = card.isReversed ? card.reversedMeaning : card.uprightMeaning;
        const position = card.position ? `Vị trí: ${card.position}` : `Lá ${index + 1}`;
        return `${position} - ${card.nameVi} (${card.name}) [${direction}]: ${meaning}`;
      })
      .join("\n");

    const userLine = userInfo?.name ? `Người xem bài: ${userInfo.name}` : "";
    const birthLine = userInfo?.birthdate ? `Ngày sinh: ${userInfo.birthdate}${userInfo.zodiac ? ` (${userInfo.zodiac})` : ""}` : "";
    const infoBlock = [userLine, birthLine].filter(Boolean).join("\n");

    const userMessage = `${infoBlock ? infoBlock + "\n" : ""}Chủ đề: ${themeNames[theme] || "Tổng Quát"}
Số lá: ${spreadType || cards.length}
${question ? `Câu hỏi: "${question}"\n` : ""}
Các lá bài:
${cardDescriptions}

Hãy đọc trải bài này.${question ? ` Trả lời trực tiếp câu hỏi: "${question}".` : ""}${infoBlock ? " Cá nhân hoá phân tích cho người dùng nếu có thể." : ""}`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await getDeepseekClient().chat.completions.create({
            model: "deepseek-chat",
            max_tokens: 3000,
            stream: true,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
          });

          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const error = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
