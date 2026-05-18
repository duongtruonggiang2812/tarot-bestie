"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/data/tarotCards";
import { getCardImageUrl } from "@/lib/cardImage";

interface CardModalProps {
  card: TarotCard | null;
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  if (!card) return null;

  const imageUrl = getCardImageUrl(card);

  const arcanaLabel =
    card.arcana === "major"
      ? "Major Arcana"
      : `Minor Arcana${card.suit ? ` · ${card.suit.charAt(0).toUpperCase()}${card.suit.slice(1)}` : ""}`;

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-lg glass rounded-3xl p-6 border border-white/60 shadow-2xl overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-purple-deep/50 hover:text-purple-deep text-xl font-bold transition-colors z-10"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Card image */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-52 rounded-xl overflow-hidden border-2 border-purple-mid/40 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={card.nameVi}
                    className="w-full h-full object-cover"
                    style={
                      card.isReversed
                        ? { transform: "rotate(180deg)", transformOrigin: "center center" }
                        : {}
                    }
                  />
                </div>
                {/* Reversed badge */}
                {card.isReversed && (
                  <div className="mt-2 px-2 py-0.5 rounded-full bg-rose/60 border border-pink-soft/40 text-center">
                    <span className="text-[10px] font-body text-purple-deep font-bold">
                      ↕ Ngược
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl font-bold text-purple-deep leading-tight">
                  {card.nameVi}
                </h2>
                <p className="font-body text-purple-deep/60 text-sm mt-0.5">{card.name}</p>
                <p className="font-body text-purple-deep/40 text-xs mt-1">{arcanaLabel}</p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {card.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2.5 py-0.5 rounded-full glass font-body text-purple-deep/70 font-semibold border border-purple-mid/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meanings */}
            <div className="mt-5 flex flex-col gap-4">
              {/* Upright */}
              <div className={`rounded-2xl p-4 border ${!card.isReversed ? "bg-mint/30 border-mint/60" : "glass border-white/40"}`}>
                <h3 className="font-display font-bold text-purple-deep text-sm mb-2 flex items-center gap-1.5">
                  Xuôi 🌟
                  {!card.isReversed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-deep/10 font-body">
                      Hiện tại
                    </span>
                  )}
                </h3>
                <p className="font-body text-purple-deep/80 text-sm leading-relaxed">
                  {card.uprightMeaning}
                </p>
              </div>

              {/* Reversed */}
              <div className={`rounded-2xl p-4 border ${card.isReversed ? "bg-rose/30 border-pink-soft/60" : "glass border-white/40"}`}>
                <h3 className="font-display font-bold text-purple-deep text-sm mb-2 flex items-center gap-1.5">
                  Ngược 🔄
                  {card.isReversed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-deep/10 font-body">
                      Hiện tại
                    </span>
                  )}
                </h3>
                <p className="font-body text-purple-deep/80 text-sm leading-relaxed">
                  {card.reversedMeaning}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
