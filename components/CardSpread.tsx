"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardSpreadProps {
  totalSlots: number;
  pickedCount: number;
  onPick: () => void;
}

export default function CardSpread({ totalSlots, pickedCount, onPick }: CardSpreadProps) {
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const SPREAD_SIZE = 22;
  const row1 = Array.from({ length: 11 }, (_, i) => i);
  const row2 = Array.from({ length: 11 }, (_, i) => i + 11);

  const handlePick = (index: number) => {
    if (usedIndices.has(index) || pickedCount >= totalSlots) return;
    setUsedIndices((prev) => new Set([...prev, index]));
    onPick();
  };

  const CardBack = ({ index }: { index: number }) => {
    const used = usedIndices.has(index);
    const isHovered = hoveredIndex === index && !used && pickedCount < totalSlots;
    const tilt = ((index % 5) - 2) * 0.7;

    return (
      <AnimatePresence>
        {!used && (
          <motion.div
            key={index}
            className="relative shrink-0 cursor-pointer"
            style={{ width: 52, height: 84 }}
            exit={{ opacity: 0, scale: 0.2, y: -50, transition: { duration: 0.4 } }}
            animate={{ y: isHovered ? -18 : 0, rotate: tilt, scale: isHovered ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => handlePick(index)}
          >
            {isHovered && (
              <div className="absolute inset-0 rounded-lg pointer-events-none z-10"
                style={{ boxShadow: "0 0 18px rgba(212,168,71,0.9), 0 0 40px rgba(212,168,71,0.4)" }} />
            )}
            <div className="w-full h-full rounded-lg border overflow-hidden select-none"
              style={{
                background: "linear-gradient(160deg, #0d1b2e 0%, #162035 50%, #0a1220 100%)",
                borderColor: isHovered ? "rgba(212,168,71,0.9)" : "rgba(180,140,60,0.3)",
                borderWidth: isHovered ? 1.5 : 1,
              }}>
              <div className="absolute inset-[3px] rounded border border-amber-600/15 pointer-events-none" />
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <div className="text-amber-500/40" style={{ fontSize: 14 }}>☽</div>
                <div className="flex gap-0.5">
                  {["✦","·","✦"].map((s, i) => <span key={i} className="text-amber-500/25" style={{ fontSize: 7 }}>{s}</span>)}
                </div>
                <div className="text-amber-500/15" style={{ fontSize: 8 }}>✧</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-center gap-1.5 flex-wrap px-2">
        {row1.map((i) => <CardBack key={i} index={i} />)}
      </div>
      <div className="flex justify-center gap-1.5 flex-wrap px-2">
        {row2.map((i) => <CardBack key={i} index={i} />)}
      </div>
    </div>
  );
}
