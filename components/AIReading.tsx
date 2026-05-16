"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/data/tarotCards";

interface AIReadingProps {
  cards: TarotCard[];
  theme: string;
  onReadingComplete?: (text: string) => void;
}

export default function AIReading({ cards, theme, onReadingComplete }: AIReadingProps) {
  const [text, setText] = useState("");
  const [isLoading, isLoadingSet] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchReading = async () => {
      try {
        isLoadingSet(true);
        setText("");
        textRef.current = "";

        const response = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cards, theme, spreadType: cards.length }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Không thể kết nối với AI. Thử lại sau nhé bestie!");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        isLoadingSet(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                setIsDone(true);
                onReadingComplete?.(textRef.current);
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  textRef.current += parsed.text;
                  setText(textRef.current);
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // skip malformed
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Có lỗi xảy ra. Thử lại nhé!");
        isLoadingSet(false);
      }
    };

    fetchReading();

    return () => {
      controller.abort();
    };
  }, [cards, theme]);

  const formattedText = text.split("\n").filter(Boolean);

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-xl border border-lavender">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-deep to-pink-soft flex items-center justify-center text-white text-lg shadow-md">
            🔮
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-purple-deep">
              Luận giải của Tarot Bestie
            </h3>
            <p className="text-xs font-body text-purple-deep/50">
              Powered by Claude AI ✨
            </p>
          </div>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="flex flex-col items-center py-8 gap-4"
              exit={{ opacity: 0 }}
            >
              <div className="flex gap-2">
                {["✨", "🔮", "💫"].map((emoji, i) => (
                  <motion.span
                    key={emoji}
                    className="text-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <p className="font-body text-purple-deep/70 text-sm animate-pulse">
                Bestie đang đọc bài cho bạn...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {error && (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">😔</p>
            <p className="font-body text-pink-soft font-semibold">{error}</p>
          </div>
        )}

        {/* Text content */}
        {!isLoading && !error && (
          <div className="font-body text-purple-deep/80 leading-relaxed space-y-3 text-sm sm:text-base">
            {formattedText.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {paragraph}
              </motion.p>
            ))}
            {!isDone && (
              <motion.span
                className="inline-block w-1 h-4 bg-purple-deep/60 rounded ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}
          </div>
        )}

        {/* Done indicator */}
        {isDone && (
          <motion.div
            className="mt-6 pt-4 border-t border-lavender flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-lg">✨</span>
            <p className="text-xs font-body text-purple-deep/50 italic">
              Tarot chỉ là gợi ý, bạn mới là người tạo nên tương lai của mình!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
