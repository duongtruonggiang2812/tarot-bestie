"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TarotCard as TarotCardType } from "@/data/tarotCards";
import { getCardImageUrl } from "@/lib/cardImage";

interface TarotCardProps {
  card: TarotCardType;
  index: number;
  isRevealed?: boolean;
  position?: string;
  onClick?: () => void;
  showBack?: boolean;
}

export default function TarotCard({
  card,
  index,
  isRevealed = false,
  position,
  onClick,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (!flipped && !isRevealed) {
      setFlipped(true);
      onClick?.();
    }
  };

  const isShowing = isRevealed || flipped;
  const imageUrl = getCardImageUrl(card);

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
        className="tarot-card w-32 h-56 sm:w-36 sm:h-64 cursor-pointer"
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
            <div className="w-full h-full glass-dark rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-purple-deep/30 shadow-lg bg-gradient-to-b from-purple-deep/20 to-lavender/40">
              <div className="text-4xl mb-1">🔮</div>
              <div className="flex flex-col gap-0.5 items-center opacity-40">
                {["✨🌙✨", "⭐💫⭐", "✨🌟✨", "⭐💫⭐", "✨🌙✨"].map((row, i) => (
                  <span key={i} className="text-xs tracking-widest">{row}</span>
                ))}
              </div>
              <p className="text-xs font-body text-purple-deep/60 mt-2 font-semibold">
                Chạm để lật
              </p>
            </div>
          </div>

          {/* Card Front — real Rider-Waite image */}
          <div
            className="tarot-card-back absolute inset-0 rounded-2xl overflow-hidden shadow-xl border-2 border-purple-mid/40"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Image — rotates for reversed cards */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={card.nameVi}
              className="absolute inset-0 w-full h-full object-cover"
              style={card.isReversed ? { transform: "rotate(180deg)", transformOrigin: "center center" } : {}}
            />
            {/* Name overlay — always right-side up */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl px-2 py-2 pointer-events-none">
              <p className="text-[11px] font-display font-bold text-white text-center leading-tight drop-shadow">
                {card.nameVi}
              </p>
              <p className="text-[9px] font-body text-white/70 text-center">
                {card.isReversed ? "↕ Ngược" : "↑ Xuôi"}
              </p>
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
