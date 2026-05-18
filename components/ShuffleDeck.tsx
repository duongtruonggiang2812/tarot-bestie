"use client";

import { useState } from "react";
import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";

interface ShuffleDeckProps {
  onDraw: () => void;
  isShuffling?: boolean;
}

const CARD_COUNT = 7;

export default function ShuffleDeck({ onDraw }: ShuffleDeckProps) {
  const [shuffleState, setShuffleState] = useState<"idle" | "shuffling" | "done">("idle");

  const handleShuffle = () => {
    if (shuffleState === "shuffling") return;
    setShuffleState("shuffling");
    setTimeout(() => {
      setShuffleState("done");
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Deck */}
      <div className="relative w-36 h-56 sm:w-44 sm:h-72">
        {Array.from({ length: CARD_COUNT }).map((_, i) => {
          const isTop = i === CARD_COUNT - 1;
          const offset = i * 2;

          let animateProps: TargetAndTransition = {
            x: -offset,
            y: -offset * 0.5,
            rotate: (i - CARD_COUNT / 2) * 0.5,
            zIndex: i,
          };

          if (shuffleState === "shuffling") {
            const side = i % 2 === 0 ? -1 : 1;
            const spreadAmount = 80 + i * 15;
            animateProps = {
              x: side * spreadAmount,
              y: -30,
              rotate: side * (20 + i * 5),
              rotateY: side * 30,
              zIndex: i,
            };
          }

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 border-purple-mid/40 shadow-md overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
              animate={animateProps}
              transition={{
                duration: shuffleState === "shuffling" ? 0.4 : 0.6,
                delay: shuffleState === "shuffling" ? i * 0.04 : i * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <div className="w-full h-full bg-gradient-to-b from-purple-deep via-purple-mid to-lavender flex flex-col items-center justify-center gap-2">
                <div className={`text-3xl ${isTop ? "opacity-100" : "opacity-60"}`}>🔮</div>
                <div className="flex flex-col gap-0.5 items-center opacity-30">
                  {["✨🌙✨", "⭐💫⭐", "✨🌟✨"].map((row, ri) => (
                    <span key={ri} className="text-[10px] tracking-widest">
                      {row}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Buttons */}
      <AnimatePresence mode="wait">
        {shuffleState !== "done" ? (
          <motion.button
            key="shuffle"
            onClick={handleShuffle}
            disabled={shuffleState === "shuffling"}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold shadow-xl disabled:opacity-60 transition-opacity"
            whileHover={shuffleState !== "shuffling" ? { scale: 1.05, y: -2 } : {}}
            whileTap={shuffleState !== "shuffling" ? { scale: 0.97 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {shuffleState === "shuffling" ? "Đang xào bài... 🌀" : "🎴 Xào bài"}
          </motion.button>
        ) : (
          <motion.div
            key="draw"
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="font-body text-purple-deep/70 text-sm">
              Bài đã được xào xong! Sẵn sàng rút chưa? ✨
            </p>
            <motion.button
              onClick={onDraw}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-soft to-peach text-white font-body font-bold shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 8px 30px rgba(232,115,154,0.3)",
                  "0 8px 50px rgba(232,115,154,0.5)",
                  "0 8px 30px rgba(232,115,154,0.3)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🃏 Rút bài thôi!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
