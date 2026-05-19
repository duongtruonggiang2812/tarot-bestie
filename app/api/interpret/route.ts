import { getDeepseekClient } from "@/lib/deepseek";
import { NextRequest } from "next/server";
import { getReader } from "@/data/tarotReaders";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, theme, spreadType, question, userInfo, readerId } = body;
    const reader = getReader(readerId ?? "mystic");
    const SYSTEM_PROMPT = reader.interpretPrompt;

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

    const genderMap: Record<string, string> = { male: "Nam", female: "Nữ", other: "Khác" };
    const userLine   = userInfo?.name      ? `Người xem bài: ${userInfo.name}` : "";
    const birthLine  = userInfo?.birthdate ? `Ngày sinh: ${userInfo.birthdate}${userInfo.zodiac ? ` (${userInfo.zodiac})` : ""}` : "";
    const genderLine = userInfo?.gender    ? `Giới tính: ${genderMap[userInfo.gender] ?? userInfo.gender}` : "";
    const infoBlock  = [userLine, birthLine, genderLine].filter(Boolean).join("\n");

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
