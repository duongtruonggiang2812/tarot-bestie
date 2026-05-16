"use client";

import { motion } from "framer-motion";
import TarotCard from "./TarotCard";
import { TarotCard as TarotCardType, spreadLayouts } from "@/data/tarotCards";

interface CardSpreadProps {
  cards: TarotCardType[];
  theme: keyof typeof spreadLayouts | "general";
  onAllRevealed?: () => void;
  revealAll?: boolean;
}

export default function CardSpread({
  cards,
  theme,
  onAllRevealed,
  revealAll = false,
}: CardSpreadProps) {
  const layout =
    theme !== "general" ? spreadLayouts[theme as keyof typeof spreadLayouts] : null;

  const getPositionName = (index: number): string | undefined => {
    if (!layout) return undefined;
    return layout.positions[index];
  };

  const getSpreadClass = () => {
    if (cards.length === 1) return "justify-center";
    if (cards.length === 3) return "justify-center gap-4 sm:gap-6";
    if (cards.length === 5) return "justify-center gap-3 sm:gap-4 flex-wrap";
    return "justify-center gap-4 flex-wrap";
  };

  return (
    <div className="w-full">
      {layout && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-2xl">{layout.emoji}</span>
          <h3 className="font-display text-xl font-bold text-purple-deep mt-1">
            {layout.name}
          </h3>
          <p className="text-sm font-body text-purple-deep/60 mt-1">
            {cards.length} lá bài • Chạm vào từng lá để khám phá
          </p>
        </motion.div>
      )}

      <div className={`flex ${getSpreadClass()} items-start`}>
        {cards.map((card, index) => (
          <TarotCard
            key={card.id}
            card={card}
            index={index}
            isRevealed={revealAll}
            position={getPositionName(index)}
            onClick={() => {
              // Check if this is the last card being revealed
              // We use a timeout to allow state to settle
              setTimeout(() => {
                onAllRevealed?.();
              }, 800);
            }}
          />
        ))}
      </div>

      {revealAll && (
        <motion.p
          className="text-center text-sm font-body text-purple-deep/50 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ✨ Tất cả {cards.length} lá bài đã được lật
        </motion.p>
      )}
    </div>
  );
}
