"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShuffleDeckProps {
  onDone: () => void;
}

const RING_CARDS = 18;
const RADIUS = 130;

export default function ShuffleDeck({ onDone }: ShuffleDeckProps) {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "done">("idle");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (phase !== "shuffling") return;
    const start = Date.now();
    const duration = 2800;
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setRotation(progress * 720); // 2 full spins
      if (progress < 1) requestAnimationFrame(frame);
      else {
        setPhase("done");
      }
    };
    requestAnimationFrame(frame);
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Circular deck */}
      <div className="relative" style={{ width: 320, height: 320 }}>
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(180,130,40,0.45) 0%, rgba(120,60,20,0.2) 50%, transparent 70%)" }}
          animate={{ scale: phase === "shuffling" ? [1, 1.15, 1] : 1, opacity: phase === "shuffling" ? [0.6, 1, 0.6] : 0.5 }}
          transition={{ duration: 1.2, repeat: phase === "shuffling" ? Infinity : 0 }}
        />

        {/* Star particles */}
        {phase === "shuffling" && Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 360 + rotation * 0.3;
          const r = 70 + (i % 3) * 30;
          const x = 160 + Math.cos((a * Math.PI) / 180) * r;
          const y = 160 + Math.sin((a * Math.PI) / 180) * r;
          return (
            <motion.div key={i} className="absolute text-xs pointer-events-none"
              style={{ left: x - 6, top: y - 6 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 0.8 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.1 }}
            >
              {i % 3 === 0 ? "✦" : i % 3 === 1 ? "·" : "✧"}
            </motion.div>
          );
        })}

        {/* Cards in ring */}
        {Array.from({ length: RING_CARDS }).map((_, i) => {
          const baseAngle = (i / RING_CARDS) * 360;
          const angle = baseAngle + rotation;
          const rad = (angle * Math.PI) / 180;
          const x = 160 + Math.cos(rad) * RADIUS - 20;
          const y = 160 + Math.sin(rad) * RADIUS - 32;
          const cardRotate = angle + 90;
          const isVisible = phase === "shuffling" || phase === "done";

          return (
            <AnimatePresence key={i}>
              {isVisible && (
                <motion.div
                  className="absolute"
                  style={{ left: x, top: y, rotate: cardRotate, transformOrigin: "center" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <div className="w-10 h-16 rounded-md border border-amber-600/60 overflow-hidden shadow-lg"
                    style={{ background: "linear-gradient(160deg, #0d1b2e 0%, #1a2744 60%, #0a1020 100%)" }}>
                    <div className="w-full h-full flex items-center justify-center opacity-70">
                      <div className="text-amber-400/80 text-xs">✦</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}

        {/* Center idle deck */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="absolute w-20 h-32 rounded-xl border border-amber-600/50 overflow-hidden shadow-xl"
                style={{
                  background: "linear-gradient(160deg, #0d1b2e 0%, #1a2744 60%, #0a1020 100%)",
                  transform: `translateY(${-i * 1.5}px) translateX(${(i - 2) * 0.5}px) rotate(${(i - 2) * 1}deg)`,
                  zIndex: i,
                }}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <div className="text-amber-400/60 text-xl">☽</div>
                  <div className="text-amber-400/30 text-[8px] tracking-widest">✦ · ✦</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text + Button */}
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="text-amber-200/60 font-body text-sm text-center leading-relaxed max-w-xs">
              Tập trung vào câu hỏi của bạn<br />và bấm xào bài khi đã sẵn sàng
            </p>
            <motion.button
              onClick={() => setPhase("shuffling")}
              className="px-10 py-3.5 rounded-full font-body font-bold text-base text-amber-900"
              style={{ background: "linear-gradient(135deg, #d4a847, #f0c060, #b8860b)" }}
              whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(212,168,71,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              🎴 Xào bài
            </motion.button>
          </motion.div>
        )}

        {phase === "shuffling" && (
          <motion.div key="shuffling" className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.p
              className="font-body text-amber-200/80 text-base tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Đang xào bài...
            </motion.p>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-200/70 font-body text-sm text-center">
              Bài đã được xào ✦ Hãy chọn những lá bài của bạn
            </p>
            <motion.button
              onClick={onDone}
              className="px-10 py-3.5 rounded-full font-body font-bold text-base text-amber-900"
              style={{ background: "linear-gradient(135deg, #d4a847, #f0c060, #b8860b)" }}
              whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(212,168,71,0.5)" }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 15px rgba(212,168,71,0.3)", "0 0 35px rgba(212,168,71,0.6)", "0 0 15px rgba(212,168,71,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦ Chọn bài thôi!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
