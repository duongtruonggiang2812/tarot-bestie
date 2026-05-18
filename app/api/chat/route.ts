import { getDeepseekClient } from "@/lib/deepseek";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, cards, theme, question, userInfo } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), { status: 400 });
    }

    const cardContext = cards
      ?.map((c: { nameVi: string; name: string; isReversed: boolean; position?: string }, i: number) =>
        `${c.position || `Lá ${i + 1}`}: ${c.nameVi} (${c.name}) [${c.isReversed ? "ngược" : "xuôi"}]`
      )
      .join("\n");

    const infoLines = [
      userInfo?.name ? `Người xem bài: ${userInfo.name}` : "",
      userInfo?.birthdate ? `Ngày sinh: ${userInfo.birthdate}${userInfo.zodiac ? ` (${userInfo.zodiac})` : ""}` : "",
    ].filter(Boolean).join("\n");

    const systemPrompt = `Bạn là nhà đọc bài tarot huyền bí, sâu sắc. Bạn đã đọc trải bài sau:

${infoLines ? infoLines + "\n" : ""}Chủ đề: ${theme || "Tổng quát"}${question ? `\nCâu hỏi: "${question}"` : ""}
Các lá bài: ${cardContext || "Không có thông tin"}

Trả lời câu hỏi tiếp theo của người dùng. Nguyên tắc:
- Ngắn gọn, đúng trọng tâm — tối đa 150 từ mỗi câu trả lời
- Giọng điệu ấm, dùng "bạn", có chiều sâu
- Không vòng vo, không sáo rỗng
- Emoji dùng tiết kiệm ✨🌙`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await getDeepseekClient().chat.completions.create({
            model: "deepseek-chat",
            max_tokens: 600,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
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
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error })}\n\n`));
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
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
