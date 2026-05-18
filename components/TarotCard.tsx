"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard as TarotCardType } from "@/data/tarotCards";
import { getCardImageUrl } from "@/lib/cardImage";

interface TarotCardProps {
  card: TarotCardType;
  index: number;
  isRevealed?: boolean;
  position?: string;
  onClick?: () => void;
  onZoom?: (card: TarotCardType) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  emoji: string;
}

const STAR_EMOJIS = ["⭐", "✨", "💫", "🌟", "⭐", "✨"];

export default function TarotCard({
  card,
  index,
  isRevealed = false,
  position,
  onClick,
  onZoom,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleKey, setParticleKey] = useState(0);

  const isShowing = isRevealed || flipped;
  const imageUrl = getCardImageUrl(card);

  // Trigger particle burst when card reveals
  useEffect(() => {
    if (isShowing && particles.length === 0) {
      const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        angle: (i / 8) * 360,
        emoji: STAR_EMOJIS[i % STAR_EMOJIS.length],
      }));
      setParticles(newParticles);
      setParticleKey((k) => k + 1);
      setTimeout(() => setParticles([]), 1200);
    }
  }, [isShowing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    if (!flipped && !isRevealed) {
      setFlipped(true);
      onClick?.();
    } else if (isShowing) {
      onZoom?.(card);
    }
  };

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

      <div className="relative">
        {/* Particle burst */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={`${particleKey}-${p.id}`}
              className="absolute pointer-events-none z-20 text-sm"
              style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * 60,
                y: Math.sin((p.angle * Math.PI) / 180) * 60,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          className="tarot-card w-44 h-72 sm:w-48 sm:h-80 cursor-pointer"
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
              <div className="w-full h-full bg-gradient-to-b from-purple-deep via-[#4a2070] to-[#2a0f4a] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-purple-mid/40 shadow-xl">
                <div className="text-5xl mb-2">🔮</div>
                <div className="flex flex-col gap-0.5 items-center opacity-30">
                  {["✨🌙✨", "⭐💫⭐", "✨🌟✨", "⭐💫⭐", "✨🌙✨"].map((row, i) => (
                    <span key={i} className="text-xs tracking-widest">{row}</span>
                  ))}
                </div>
                <p className="text-xs font-body text-white/50 mt-2 font-semibold">
                  Chạm để lật ✨
                </p>
              </div>
            </div>

            {/* Card Front */}
            <div
              className="tarot-card-back absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: card.isReversed ? "2px solid #f9a8d4" : "2px solid rgba(167,139,250,0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={card.nameVi}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Reversed overlay tint */}
              {card.isReversed && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(249,168,212,0.15) 0%, rgba(196,181,253,0.15) 100%)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Reversed badge top */}
              {card.isReversed && (
                <div style={{
                  position: "absolute",
                  top: 6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(249,168,212,0.85)",
                  borderRadius: 99,
                  padding: "1px 8px",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#7c3aed",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}>
                  ↕ NGƯỢC
                </div>
              )}

              {/* Name overlay bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl px-2 py-2 pointer-events-none">
                <p className="text-[11px] font-display font-bold text-white text-center leading-tight drop-shadow">
                  {card.nameVi}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keywords shown after reveal */}
      {isShowing && (
        <motion.div
          className="flex flex-wrap gap-1 justify-center max-w-44"
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
