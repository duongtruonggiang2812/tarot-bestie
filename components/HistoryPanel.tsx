"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface Reading {
  id: string;
  created_at: string;
  theme: string;
  cards: Array<{ nameVi: string; name: string; isReversed?: boolean }>;
  ai_summary: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_EMOJIS: Record<string, string> = {
  love: "💕",
  career: "💼",
  finance: "💰",
  self: "🌸",
  general: "🔮",
};

const THEME_NAMES: Record<string, string> = {
  love: "Tình Yêu",
  career: "Sự Nghiệp",
  finance: "Tài Chính",
  self: "Bản Thân",
  general: "Tổng Quát",
};

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { data: session, status } = useSession();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Reading | null>(null);

  useEffect(() => {
    if (isOpen && status === "authenticated") {
      setLoading(true);
      fetch("/api/readings")
        .then((r) => r.json())
        .then((data) => {
          setReadings(Array.isArray(data) ? data : []);
        })
        .catch(() => setReadings([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, status]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (selected) setSelected(null);
              else onClose();
            }}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm glass border-l border-white/40 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/40 bg-lavender/20">
              <h2 className="font-display font-bold text-purple-deep text-lg">
                {selected ? "Chi tiết bói" : "Lịch sử bói 📖"}
              </h2>
              <button
                onClick={() => {
                  if (selected) setSelected(null);
                  else onClose();
                }}
                className="text-purple-deep/50 hover:text-purple-deep text-xl font-bold transition-colors"
              >
                {selected ? "←" : "✕"}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {status !== "authenticated" ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <span className="text-5xl">✨</span>
                  <p className="font-body text-purple-deep/70 text-sm">
                    Đăng nhập để lưu lịch sử ✨
                  </p>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-3xl animate-spin">🔮</div>
                </div>
              ) : selected ? (
                // Detail view
                <div className="flex flex-col gap-4">
                  <div className="glass rounded-2xl p-4 border border-white/60">
                    <p className="font-body text-purple-deep/50 text-xs mb-1">
                      {formatDate(selected.created_at)}
                    </p>
                    <p className="font-display font-bold text-purple-deep text-base">
                      {THEME_EMOJIS[selected.theme] ?? "🔮"} {THEME_NAMES[selected.theme] ?? selected.theme}
                    </p>
                  </div>

                  {/* Cards */}
                  <div>
                    <p className="font-body font-bold text-purple-deep text-sm mb-2">Lá bài:</p>
                    <div className="flex flex-col gap-2">
                      {(selected.cards ?? []).map((card, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/50"
                        >
                          <span className="text-xs font-body text-purple-deep/50">
                            Lá {i + 1}
                          </span>
                          <span className="font-body font-semibold text-purple-deep text-sm flex-1">
                            {card.nameVi}
                          </span>
                          <span className="text-[10px] font-body text-purple-deep/40">
                            {card.isReversed ? "↕ Ngược" : "↑ Xuôi"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {selected.ai_summary && (
                    <div className="glass rounded-2xl p-4 border border-white/60">
                      <p className="font-body font-bold text-purple-deep text-sm mb-2">
                        Luận giải AI 🔮
                      </p>
                      <p className="font-body text-purple-deep/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {selected.ai_summary}
                      </p>
                    </div>
                  )}
                </div>
              ) : readings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <span className="text-5xl">🌙</span>
                  <p className="font-body text-purple-deep/60 text-sm">
                    Chưa có lịch sử bói nào bestie 🌙
                  </p>
                  <p className="font-body text-purple-deep/40 text-xs">
                    Rút bài đầu tiên của bạn ngay nào!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {readings.map((reading) => (
                    <motion.button
                      key={reading.id}
                      onClick={() => setSelected(reading)}
                      className="w-full text-left glass rounded-2xl p-4 border border-white/60 hover:border-purple-mid/40 transition-colors"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-purple-deep text-sm">
                            {THEME_EMOJIS[reading.theme] ?? "🔮"}{" "}
                            {THEME_NAMES[reading.theme] ?? reading.theme}
                          </p>
                          <p className="font-body text-purple-deep/50 text-[11px] mt-0.5">
                            {formatDate(reading.created_at)}
                          </p>
                          {reading.cards && reading.cards.length > 0 && (
                            <p className="font-body text-purple-deep/60 text-xs mt-1 truncate">
                              {reading.cards.map((c) => c.nameVi).join(" · ")}
                            </p>
                          )}
                          {reading.ai_summary && (
                            <p className="font-body text-purple-deep/50 text-xs mt-1 line-clamp-2">
                              {reading.ai_summary.slice(0, 80)}...
                            </p>
                          )}
                        </div>
                        <span className="text-purple-deep/30 text-sm flex-shrink-0">→</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
