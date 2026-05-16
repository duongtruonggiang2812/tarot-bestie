"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ParticleEffect from "@/components/ParticleEffect";
import CardSpread from "@/components/CardSpread";
import AIReading from "@/components/AIReading";
import ShareCard from "@/components/ShareCard";
import { TarotCard, getRandomCards, spreadLayouts } from "@/data/tarotCards";

type Theme = keyof typeof spreadLayouts | "general";
type Step = "setup" | "drawing" | "revealed" | "reading" | "share";

const THEMES: { id: Theme; emoji: string; name: string }[] = [
  { id: "general", emoji: "🔮", name: "Tổng Quát" },
  { id: "love", emoji: "💕", name: "Tình Yêu" },
  { id: "career", emoji: "💼", name: "Sự Nghiệp" },
  { id: "finance", emoji: "💰", name: "Tài Chính" },
  { id: "self", emoji: "🌸", name: "Bản Thân" },
];

const CARD_COUNTS = [1, 3, 5];

function ReadingPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTheme = (searchParams.get("theme") as Theme) || "general";
  const quickMode = searchParams.get("quick") === "true";

  const [step, setStep] = useState<Step>("setup");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(initialTheme);
  const [selectedCount, setSelectedCount] = useState<number>(quickMode ? 1 : 3);
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [readingText, setReadingText] = useState("");
  const [showReading, setShowReading] = useState(false);

  // Auto-start for quick mode
  useEffect(() => {
    if (quickMode) {
      handleDraw();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDraw = useCallback(() => {
    const drawn = getRandomCards(selectedCount);
    setCards(drawn);
    setRevealedCount(0);
    setShowReading(false);
    setReadingText("");
    setStep("drawing");
  }, [selectedCount]);

  const handleCardRevealed = useCallback(() => {
    setRevealedCount((prev) => {
      const next = prev + 1;
      if (next >= cards.length) {
        setTimeout(() => setStep("revealed"), 1000);
      }
      return next;
    });
  }, [cards.length]);

  const handleRevealAll = useCallback(() => {
    setStep("revealed");
    setTimeout(() => setShowReading(true), 800);
    setStep("reading");
  }, []);

  const handleReadingComplete = useCallback((text: string) => {
    setReadingText(text);
    setStep("share");
  }, []);

  const handleReset = () => {
    setStep("setup");
    setCards([]);
    setRevealedCount(0);
    setReadingText("");
    setShowReading(false);
  };

  return (
    <main className="relative min-h-screen bg-celestial overflow-hidden">
      <ParticleEffect />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 text-purple-deep/70 font-body text-sm font-semibold"
            whileHover={{ x: -3 }}
          >
            ← Về trang chủ
          </motion.button>
        </Link>
        <span className="font-display font-bold text-purple-deep text-lg">🔮 Tarot Bestie</span>
        {step !== "setup" && (
          <motion.button
            className="text-sm font-body text-purple-deep/60 font-semibold"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
          >
            Làm lại ↺
          </motion.button>
        )}
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-20">
        <AnimatePresence mode="wait">
          {/* SETUP STEP */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-10"
            >
              {/* Title */}
              <div className="text-center">
                <motion.h1
                  className="font-display text-4xl sm:text-5xl font-bold text-purple-deep"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Xem bói nào! ✨
                </motion.h1>
                <p className="font-body text-purple-deep/60 mt-2 text-sm">
                  Chọn chủ đề và số lá bài, rồi để vũ trụ nói chuyện với bạn 🌙
                </p>
              </div>

              {/* Theme Selection */}
              <div className="w-full max-w-2xl">
                <h2 className="font-display font-bold text-purple-deep text-lg mb-4 text-center">
                  Chủ đề hôm nay của bạn?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {THEMES.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all font-body ${
                        selectedTheme === t.id
                          ? "border-purple-mid bg-lavender/60 shadow-lg"
                          : "border-white/50 glass hover:border-purple-mid/40"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-xs font-bold text-purple-deep">{t.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card Count Selection */}
              <div className="w-full max-w-md">
                <h2 className="font-display font-bold text-purple-deep text-lg mb-4 text-center">
                  Rút bao nhiêu lá?
                </h2>
                <div className="flex justify-center gap-4">
                  {CARD_COUNTS.map((count) => (
                    <motion.button
                      key={count}
                      onClick={() => setSelectedCount(count)}
                      className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all font-body ${
                        selectedCount === count
                          ? "border-purple-mid bg-lavender/60 shadow-lg"
                          : "border-white/50 glass hover:border-purple-mid/40"
                      }`}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl font-display font-bold text-purple-deep">
                        {count}
                      </span>
                      <span className="text-[10px] text-purple-deep/60 font-semibold">
                        {count === 1 ? "lá" : "lá bài"}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-xs font-body text-purple-deep/40 mt-3">
                  {selectedCount === 1 && "Nhanh gọn, 1 lá bài chính 🎯"}
                  {selectedCount === 3 && "Quá khứ - Hiện tại - Tương lai 🌙"}
                  {selectedCount === 5 && "Trải bài đầy đủ, chi tiết nhất ✨"}
                </p>
              </div>

              {/* Draw Button */}
              <motion.button
                onClick={handleDraw}
                className="px-12 py-5 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-lg shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    "0 10px 40px rgba(123,79,166,0.3)",
                    "0 10px 60px rgba(232,115,154,0.5)",
                    "0 10px 40px rgba(123,79,166,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🃏 Rút bài thôi!
              </motion.button>
            </motion.div>
          )}

          {/* DRAWING STEP */}
          {(step === "drawing" || step === "revealed" || step === "reading" || step === "share") && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Status message */}
              <motion.div className="text-center" layout>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-purple-deep">
                  {step === "drawing" && "Chạm vào từng lá để lật bài ✨"}
                  {step === "revealed" && "Tất cả lá bài đã lộ diện! 🌟"}
                  {step === "reading" && "Bestie đang đọc bài cho bạn... 🔮"}
                  {step === "share" && "Đọc xong rồi! Chia sẻ thôi 📸"}
                </h2>
                <p className="font-body text-purple-deep/60 text-sm mt-1">
                  {THEMES.find((t) => t.id === selectedTheme)?.emoji}{" "}
                  {THEMES.find((t) => t.id === selectedTheme)?.name} •{" "}
                  {selectedCount} lá bài
                </p>
              </motion.div>

              {/* Card Spread */}
              <div className="w-full">
                <CardSpread
                  cards={cards}
                  theme={selectedTheme}
                  onAllRevealed={handleCardRevealed}
                  revealAll={step === "revealed" || step === "reading" || step === "share"}
                />
              </div>

              {/* Reveal All button (after drawing step) */}
              {step === "drawing" && cards.length > 0 && (
                <motion.button
                  onClick={handleRevealAll}
                  className="px-8 py-3 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  Lật hết tất cả ✨
                </motion.button>
              )}

              {/* AI Reading */}
              {(step === "reading" || step === "share") && showReading && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AIReading
                    cards={cards}
                    theme={selectedTheme}
                    onReadingComplete={handleReadingComplete}
                  />
                </motion.div>
              )}

              {/* Auto trigger reading after revealed */}
              {step === "revealed" && (
                <motion.button
                  onClick={() => {
                    setShowReading(true);
                    setStep("reading");
                  }}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  🔮 Đọc luận giải AI
                </motion.button>
              )}

              {/* Share section */}
              {step === "share" && readingText && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold text-purple-deep">
                      Chia sẻ kết quả 📸
                    </h3>
                    <p className="font-body text-purple-deep/60 text-sm mt-1">
                      Lưu ảnh để share Story cho bạn bè cùng biết!
                    </p>
                  </div>
                  <ShareCard cards={cards} theme={selectedTheme} readingText={readingText} />
                </motion.div>
              )}

              {/* Draw again */}
              {(step === "share" || step === "revealed") && (
                <motion.div
                  className="flex gap-3 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full glass border border-purple-mid/30 text-purple-deep font-body font-bold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ↺ Xem lại từ đầu
                  </motion.button>
                  <motion.button
                    onClick={handleDraw}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-sm shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    🃏 Rút bài mới
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-celestial flex items-center justify-center">
          <motion.div
            className="flex gap-3 text-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🔮
          </motion.div>
        </div>
      }
    >
      <ReadingPageInner />
    </Suspense>
  );
}
