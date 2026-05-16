import { getDeepseekClient } from "@/lib/deepseek";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Bạn là một nhà chiêm tinh tarot huyền bí và am hiểu, chuyên đọc bài tarot cho thế hệ Gen Z Việt Nam.

Phong cách của bạn:
- Nói chuyện thân thiết như bạn bè, dùng "bạn ơi", "bestie", thỉnh thoảng dùng từ tiếng Anh xen vào như "vibe", "energy", "honestly", "lowkey", "slay", "it's giving..."
- Hài hước nhưng sâu sắc, không quá nghiêm túc nhưng cũng không hời hợt
- Sử dụng emoji phù hợp để tạo sự sinh động ✨🌙🔮💫
- Diễn giải bài tarot theo ngữ cảnh của người trẻ hiện đại Việt Nam
- Đưa ra lời khuyên thực tế, actionable

Khi đọc bài:
1. Nhận xét về năng lượng tổng thể của trải bài
2. Phân tích từng lá bài theo vị trí của nó
3. Kết nối các lá bài với nhau để tạo thành câu chuyện
4. Đưa ra lời khuyên cụ thể và tích cực
5. Kết thúc bằng một câu khích lệ ngắn gọn, đầy năng lượng

Luôn nhớ: tarot là công cụ để tự reflection, không phải để phán xét hay tiên đoán tương lai cố định. Mọi thứ đều có thể thay đổi dựa trên hành động của bạn!`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, theme, spreadType } = body;

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

    const userMessage = `Chủ đề: ${themeNames[theme] || "Tổng Quát 🔮"}
Kiểu trải bài: ${spreadType || cards.length} lá

Các lá bài được rút:
${cardDescriptions}

Hãy đọc và giải thích trải bài này cho mình nhé! Nhớ kết nối các lá bài với chủ đề "${themeNames[theme] || "Tổng Quát"}" và đưa ra lời khuyên cụ thể.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await getDeepseekClient().chat.completions.create({
            model: "deepseek-chat",
            max_tokens: 1500,
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
