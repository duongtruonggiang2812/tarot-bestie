"use client";

import { useState } from "react";
import { useCoinStore } from "@/store/coinStore";
import PurchaseModal from "@/components/PurchaseModal";

export default function CoinBadge() {
  const { coins } = useCoinStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-sm transition-all hover:scale-105 border ${
          coins < 5
            ? "bg-red-100/80 border-red-300/60 text-red-600"
            : "glass border-white/60 text-purple-deep"
        }`}
      >
        <span>🪙</span>
        <span>{coins}</span>
        {coins < 5 && <span className="text-xs">!</span>}
      </button>

      <PurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
