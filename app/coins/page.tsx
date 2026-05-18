"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCoinStore, COIN_PACKAGES, getAiReadCost } from "@/store/coinStore";
import Link from "next/link";

const HOW_IT_WORKS = [
  { emoji: "🎴", label: "Xào & lật bài", cost: "Miễn phí mãi mãi" },
  { emoji: "🔮", label: "AI đọc 1 lá", cost: "2 xu" },
  { emoji: "🔮", label: "AI đọc 3 lá", cost: "4 xu" },
  { emoji: "🔮", label: "AI đọc 5 lá", cost: "6 xu" },
  { emoji: "💬", label: "Chat hỏi thêm bestie", cost: "1 xu / tin" },
  { emoji: "📅", label: "Điểm danh mỗi ngày", cost: "+3 xu miễn phí" },
];

export default function CoinsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { coins } = useCoinStore();
  const [toast, setToast] = useState<string | null>(null);

  const handleBuy = (pkg: typeof COIN_PACKAGES[0]) => {
    setToast(`Tính năng thanh toán đang cập nhật — mình sẽ sớm ra mắt nhé! 💕`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-celestial relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["10%", "30%", "55%", "75%", "90%"].map((left, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left, top: `${10 + i * 15}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-white/40 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-deep/70 font-body font-semibold text-base hover:text-purple-deep transition-colors"
          >
            ← Quay lại
          </button>
          <span className="font-display font-bold text-purple-deep text-lg">🪙 Nạp Xu</span>
          {session && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/60 font-body font-bold text-sm text-purple-deep">
              🪙 {coins}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">

        {/* Hero */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-3">🔮</div>
          <h1 className="font-display text-3xl font-bold text-purple-deep mb-2">
            Nạp xu để hỏi bestie thêm nhé!
          </h1>
          <p className="font-body text-purple-deep/60 text-base">
            Xào bài & lật bài mãi mãi miễn phí · Tốn xu khi nhận AI đọc bài 💜
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="mb-8 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(160deg,#fff 0%,#f5f0ff 100%)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="px-5 py-4 border-b border-purple-mid/10">
            <h2 className="font-display font-bold text-purple-deep text-lg">Xu dùng để làm gì?</h2>
          </div>
          <div className="divide-y divide-purple-mid/8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-body text-purple-deep/80 text-sm">{item.label}</span>
                </div>
                <span className={`font-body font-bold text-sm ${
                  item.cost.includes("Miễn phí") || item.cost.includes("+")
                    ? "text-emerald-600"
                    : "text-purple-deep"
                }`}>
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Packages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-purple-deep text-xl mb-4 text-center">
            Chọn gói của bạn 👇
          </h2>

          <div className="flex flex-col gap-4">
            {COIN_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                className={`relative rounded-3xl overflow-hidden ${
                  pkg.popular
                    ? "shadow-xl shadow-purple-mid/20"
                    : "shadow-md"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="bg-gradient-to-r from-purple-deep to-pink-soft text-white text-xs font-bold font-body text-center py-1.5 tracking-wider uppercase">
                    ⭐ Phổ biến nhất · Tiết kiệm nhất
                  </div>
                )}

                <div
                  className={`p-5 flex items-center justify-between ${
                    pkg.popular
                      ? "bg-gradient-to-r from-purple-deep/5 to-pink-soft/10 border-2 border-purple-mid/40"
                      : "bg-white/80 border border-white/60"
                  }`}
                >
                  {/* Left: name + coins */}
                  <div>
                    <p className="font-display font-bold text-purple-deep text-lg leading-tight">
                      {pkg.name}
                    </p>
                    <p className="font-body text-purple-deep/60 text-sm mt-0.5">
                      🪙 {pkg.coins} xu
                      {pkg.coins >= 100 && (
                        <span className="ml-2 text-emerald-600 font-semibold">
                          (~{Math.floor(pkg.coins / 2)} lần đọc bài)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Right: price + buy */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full font-body font-bold text-base ${
                        pkg.popular
                          ? "bg-gradient-to-r from-purple-deep to-purple-mid text-white"
                          : "bg-gradient-to-r from-purple-deep/80 to-pink-soft/80 text-white"
                      }`}
                    >
                      {pkg.price}
                    </span>
                    <button
                      onClick={() => handleBuy(pkg)}
                      className="text-sm font-body font-semibold text-purple-deep/60 hover:text-purple-deep underline transition-colors"
                    >
                      Mua ngay →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily bonus reminder */}
        <motion.div
          className="mt-8 rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-3xl">📅</span>
          <div>
            <p className="font-body font-bold text-emerald-700 text-sm">Đăng nhập mỗi ngày để nhận 3 xu miễn phí!</p>
            <p className="font-body text-emerald-600/70 text-xs mt-0.5">Quay lại app mỗi ngày — xu tự cộng, khỏi lo 🌿</p>
          </div>
        </motion.div>

        {/* Back to reading */}
        <div className="mt-8 text-center">
          <Link
            href="/reading"
            className="font-body text-purple-deep/50 hover:text-purple-deep text-sm transition-colors underline"
          >
            ← Quay lại trải bài
          </Link>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg font-body text-sm font-semibold text-white max-w-xs text-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
