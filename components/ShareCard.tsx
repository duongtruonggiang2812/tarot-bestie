"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TarotCard } from "@/data/tarotCards";

interface ShareCardProps {
  cards: TarotCard[];
  theme: string;
  readingText: string;
}

export default function ShareCard({ cards, theme, readingText }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const themeEmojis: Record<string, string> = {
    love: "💕",
    career: "💼",
    finance: "💰",
    self: "🌸",
    general: "🔮",
  };

  const themeNames: Record<string, string> = {
    love: "Tình Yêu",
    career: "Sự Nghiệp",
    finance: "Tài Chính",
    self: "Bản Thân",
    general: "Tổng Quát",
  };

  const handleCapture = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FFF9F0",
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `tarot-reading-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopyText = async () => {
    const shareText = `🔮 Tarot Bestie - ${themeEmojis[theme]} ${themeNames[theme]}\n\nLá bài: ${cards.map((c) => c.nameVi).join(", ")}\n\n${readingText.slice(0, 300)}...\n\n✨ Xem bói tại: Tarot Bestie App`;

    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const preview = readingText.slice(0, 200) + (readingText.length > 200 ? "..." : "");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Shareable card preview */}
      <div
        ref={cardRef}
        className="rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-cream via-lavender to-rose"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-3xl mb-1">🔮</p>
          <h2 className="text-xl font-bold text-purple-deep" style={{ fontFamily: "Playfair Display, serif" }}>
            Tarot Bestie
          </h2>
          <p className="text-sm text-purple-deep/60">
            {themeEmojis[theme]} {themeNames[theme]}
          </p>
        </div>

        {/* Cards row */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-24 rounded-xl flex flex-col items-center justify-center gap-1 shadow-md bg-white/50 border border-purple-deep/20">
                <span className={`text-2xl ${card.isReversed ? "rotate-180" : ""}`}>
                  {card.emoji}
                </span>
                <span className="text-[8px] text-purple-deep font-bold text-center leading-tight px-1">
                  {card.nameVi}
                </span>
              </div>
              {card.isReversed && (
                <span className="text-[9px] text-pink-soft mt-0.5">ngược</span>
              )}
            </div>
          ))}
        </div>

        {/* Reading preview */}
        <div className="glass rounded-2xl p-4 text-sm text-purple-deep/80 leading-relaxed">
          {preview}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-purple-deep/40 mt-3">
          ✨ Tarot Bestie App • Powered by Claude AI
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <motion.button
          onClick={handleCapture}
          disabled={isCapturing}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-sm shadow-lg disabled:opacity-70 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCapturing ? (
            <>
              <span className="animate-spin">⏳</span> Đang tạo ảnh...
            </>
          ) : (
            <>
              📸 Lưu ảnh
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleCopyText}
          className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-sm shadow-md transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCopied ? (
            <>✅ Đã copy!</>
          ) : (
            <>📋 Copy text</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
