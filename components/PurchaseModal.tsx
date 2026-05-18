"use client";

import { motion, AnimatePresence } from "framer-motion";
import { COIN_PACKAGES } from "@/store/coinStore";
import { useState } from "react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ isOpen, onClose }: PurchaseModalProps) {
  const [toast, setToast] = useState(false);

  const handleBuy = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md glass rounded-3xl p-6 border border-white/60 shadow-2xl"
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-purple-deep/50 hover:text-purple-deep text-xl font-bold transition-colors"
            >
              ✕
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-purple-deep">
                Nạp xu để xem bói thêm bestie! 🪙
              </h2>
              <p className="font-body text-purple-deep/60 text-sm mt-1">
                Chọn gói phù hợp với bạn nhé ✨
              </p>
            </div>

            {/* Packages */}
            <div className="flex flex-col gap-3">
              {COIN_PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  className={`relative rounded-2xl p-4 border-2 transition-all ${
                    pkg.popular
                      ? "border-purple-mid bg-lavender/40 shadow-lg shadow-purple-mid/20"
                      : "border-white/60 glass"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white text-[10px] font-bold font-body uppercase tracking-wider">
                      Phổ biến nhất ⭐
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pkg.emoji}</span>
                      <div>
                        <p className="font-display font-bold text-purple-deep text-base">
                          {pkg.name}
                        </p>
                        <p className="font-body text-purple-deep/70 text-sm">
                          🪙 {pkg.coins} xu
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-sm">
                        {pkg.price}
                      </span>
                      <button
                        onClick={handleBuy}
                        className="text-xs font-body text-purple-deep/60 hover:text-purple-deep underline transition-colors"
                      >
                        Mua ngay →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  className="mt-4 p-3 rounded-xl bg-rose/60 border border-pink-soft/40 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-body text-purple-deep text-sm">
                    Tính năng thanh toán đang cập nhật, vui lòng thử lại sau! 💕
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
