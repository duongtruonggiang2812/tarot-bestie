"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TarotCard as TarotCardType } from "@/data/tarotCards";

interface TarotCardProps {
  card: TarotCardType;
  index: number;
  isRevealed?: boolean;
  position?: string;
  onClick?: () => void;
  showBack?: boolean;
}

const CARD_BACK_PATTERN = "🌙✨🔮⭐💫🌟✨🔮🌙";

export default function TarotCard({
  card,
  index,
  isRevealed = false,
  position,
  onClick,
  showBack = false,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (!flipped && !isRevealed) {
      setFlipped(true);
      onClick?.();
    }
  };

  const isShowing = isRevealed || flipped;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      {position && (
        <span className="text-xs font-body text-purple-deep/70 font-semibold uppercase tracking-wider text-center">
          {position}
        </span>
      )}

      <div
        className="tarot-card w-32 h-48 sm:w-36 sm:h-56 cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={isShowing ? `Lá bài ${card.nameVi}` : "Lật bài"}
      >
        <motion.div
          className="tarot-card-inner relative w-full h-full"
          animate={{ rotateY: isShowing ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Back */}
          <div
            className="tarot-card-front absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full glass-dark rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-purple-deep/30 shadow-lg">
              <div className="text-4xl mb-1">🔮</div>
              <div className="grid grid-cols-3 gap-1 text-xs opacity-50 px-3">
                {CARD_BACK_PATTERN.split("").map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </div>
              <p className="text-xs font-body text-purple-deep/60 mt-2 font-semibold">
                Chạm để lật
              </p>
            </div>
          </div>

          {/* Card Front */}
          <div
            className="tarot-card-back absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div
              className={`w-full h-full rounded-2xl flex flex-col items-center justify-between p-3 shadow-xl border-2 ${
                card.isReversed
                  ? "border-pink-soft/50 bg-gradient-to-b from-rose to-lavender"
                  : "border-purple-mid/40 bg-gradient-to-b from-lavender to-cream"
              }`}
            >
              {/* Card number/suit tag */}
              <div className="w-full flex justify-between items-start">
                <span className="text-xs font-body text-purple-deep/60 font-bold">
                  {card.arcana === "major"
                    ? `${card.number}`
                    : card.suit?.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs text-purple-deep/40">
                  {card.isReversed ? "↕" : "↑"}
                </span>
              </div>

              {/* Main emoji */}
              <div
                className={`text-5xl ${card.isReversed ? "rotate-180" : ""} transition-transform`}
              >
                {card.emoji}
              </div>

              {/* Card name */}
              <div className="text-center">
                <p className="text-xs font-display font-bold text-purple-deep leading-tight">
                  {card.nameVi}
                </p>
                <p className="text-[10px] font-body text-purple-deep/50 mt-0.5">
                  {card.isReversed ? "Ngược" : "Xuôi"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keywords shown after reveal */}
      {isShowing && (
        <motion.div
          className="flex flex-wrap gap-1 justify-center max-w-36"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {card.keywords.slice(0, 2).map((kw) => (
            <span
              key={kw}
              className="text-[10px] px-2 py-0.5 rounded-full glass font-body text-purple-deep/70 font-semibold"
            >
              {kw}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
