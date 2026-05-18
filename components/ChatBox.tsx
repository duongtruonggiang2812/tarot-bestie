"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCoinStore, COIN_COSTS } from "@/store/coinStore";
import { TarotCard } from "@/data/tarotCards";
import { type UserInfo } from "@/components/BirthInfoModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  cards: TarotCard[];
  theme: string;
  initialReading: string;
  question?: string;
  userInfo?: UserInfo | null;
}

const SUGGESTED_QUESTIONS = [
  "Giải thích lá 1 rõ hơn ✨",
  "Lời khuyên cụ thể? 💡",
  "Tuần tới thế nào? 🔮",
  "Lá nào quan trọng nhất? ⭐",
];

export default function ChatBox({ cards, theme, initialReading, question, userInfo }: ChatBoxProps) {
  const { data: session } = useSession();
  const { coins, spendCoins } = useCoinStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Check coins
    if (coins < COIN_COSTS.chatMessage) {
      setWarning("Không đủ xu để hỏi bestie! Hãy nạp thêm xu nhé 🪙");
      setTimeout(() => setWarning(""), 3000);
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setWarning("");

    // Deduct coin
    spendCoins(COIN_COSTS.chatMessage);
    if (session?.user?.id) {
      fetch("/api/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spend", amount: COIN_COSTS.chatMessage }),
      }).catch(() => {});
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          cards,
          theme,
          question,
          userInfo: userInfo?.name || userInfo?.birthdate ? userInfo : null,
          context: initialReading,
        }),
      });

      if (!response.ok || !response.body) throw new Error("Failed");

      // Stream response
      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + parsed.text,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi bestie, có lỗi xảy ra rồi. Thử lại nhé! 😢" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full glass rounded-3xl border border-white/60 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-lavender/30 border-b border-white/40">
        <h3 className="font-display font-bold text-purple-deep text-lg">
          Hỏi thêm bestie! 💬
        </h3>
        <p className="font-body text-purple-deep/60 text-sm mt-0.5">
          Mỗi câu hỏi tốn <strong>{COIN_COSTS.chatMessage} xu</strong> 🪙 · Bạn còn <strong>{coins} xu</strong>
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 flex flex-col gap-3"
      >
        {messages.length === 0 ? (
          <p className="font-body text-purple-deep/40 text-sm text-center mt-8">
            Hỏi bestie điều gì đó nhé ✨
          </p>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl font-body text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-deep to-purple-mid text-white rounded-br-sm"
                    : "glass border border-white/60 text-purple-deep rounded-bl-sm"
                }`}
              >
                {msg.content}
                {msg.role === "assistant" && isLoading && i === messages.length - 1 && !msg.content && (
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass border border-white/60 px-3 py-2 rounded-2xl rounded-bl-sm">
              <span className="inline-flex gap-1 text-purple-deep">
                <span className="animate-bounce text-sm">●</span>
                <span className="animate-bounce text-sm" style={{ animationDelay: "0.15s" }}>●</span>
                <span className="animate-bounce text-sm" style={{ animationDelay: "0.3s" }}>●</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Warning */}
      <AnimatePresence>
        {warning && (
          <motion.div
            className="mx-4 mb-2 p-2 rounded-xl bg-rose/50 border border-pink-soft/40"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-body text-purple-deep text-xs text-center">{warning}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full glass border border-purple-mid/30 font-body text-purple-deep/70 hover:text-purple-deep hover:border-purple-mid/60 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/40 bg-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Hỏi bestie về lá bài của bạn..."
          disabled={isLoading}
          className="flex-1 bg-white/50 border border-white/60 rounded-xl px-3 py-2 font-body text-sm text-purple-deep placeholder-purple-deep/40 outline-none focus:border-purple-mid/60 transition-colors disabled:opacity-60"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-sm shadow-md disabled:opacity-50 transition-opacity hover:shadow-lg"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
