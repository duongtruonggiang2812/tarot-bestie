"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TAROT_READERS, type TarotReader } from "@/data/tarotReaders";

/* ── Detail Modal ─────────────────────────────────────────────────────────── */
function ReaderDetailModal({
  reader,
  isSelected,
  onClose,
  onSelect,
}: {
  reader: TarotReader;
  isSelected: boolean;
  onClose: () => void;
  onSelect: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(170deg, #120820 0%, #0d0618 100%)",
          border: `1.5px solid ${reader.color}70`,
          boxShadow: `0 0 40px ${reader.color}30, 0 20px 60px rgba(0,0,0,0.7)`,
        }}
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Top accent */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${reader.color}cc, transparent)` }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)" }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-7 pb-5 px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{
              background: reader.avatarBg,
              border: `2px solid ${reader.color}70`,
              boxShadow: `0 0 24px ${reader.color}50`,
            }}
          >
            {reader.emoji}
          </div>
          <h3
            className="font-display font-bold text-xl mt-4 text-center"
            style={{ color: reader.color }}
          >
            {reader.name}
          </h3>
          <p className="font-body text-xs mt-1.5" style={{ color: "rgba(212,168,71,0.5)" }}>
            {reader.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {reader.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full font-body text-[11px] font-semibold"
                style={{
                  background: `${reader.color}20`,
                  color: reader.color,
                  border: `1px solid ${reader.color}45`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Strengths */}
        <div className="px-6 py-4">
          <p
            className="font-body text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: `${reader.color}bb` }}
          >
            Điểm mạnh
          </p>
          <div className="flex flex-col gap-2.5">
            {reader.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-xs mt-0.5 shrink-0" style={{ color: reader.color }}>✦</span>
                <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(220,210,240,0.75)" }}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div
          className="mx-5 mb-4 px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="font-body text-sm italic text-center leading-relaxed"
            style={{ color: "rgba(220,210,240,0.5)" }}
          >
            &ldquo;{reader.quote}&rdquo;
          </p>
        </div>

        {/* Specialties */}
        <div className="px-6 pb-2">
          <p
            className="font-body text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: `${reader.color}bb` }}
          >
            Chuyên đọc
          </p>
          <div className="flex flex-col gap-1.5">
            {reader.specialties.map((s, i) => (
              <p key={i} className="font-body text-sm" style={{ color: "rgba(220,210,240,0.5)" }}>
                · {s}
              </p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 py-5">
          <motion.button
            className="w-full py-3.5 rounded-2xl font-body font-bold text-sm"
            style={
              isSelected
                ? { background: `linear-gradient(135deg, ${reader.color}, ${reader.color}99)`, color: "#fff" }
                : { background: "linear-gradient(135deg, #d4a847, #a07818)", color: "#1a0e00" }
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { onSelect(); onClose(); }}
          >
            {isSelected ? "✓ Đang chọn reader này" : "Chọn reader này →"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Reader Card ──────────────────────────────────────────────────────────── */
function ReaderCard({
  reader,
  isSelected,
  onSelect,
  onDetail,
}: {
  reader: TarotReader;
  isSelected: boolean;
  onSelect: () => void;
  onDetail: () => void;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(170deg, #120820 0%, #0d0618 100%)",
        border: isSelected
          ? `1.5px solid ${reader.color}99`
          : "1.5px solid rgba(255,255,255,0.07)",
        boxShadow: isSelected
          ? `0 0 28px ${reader.color}35, 0 8px 32px rgba(0,0,0,0.5)`
          : "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onClick={onSelect}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Top glow line */}
      <div
        className="w-full h-0.5 shrink-0"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${reader.color}cc, transparent)`
            : "transparent",
        }}
      />

      {/* Info button — top right */}
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all z-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          color: "rgba(212,168,71,0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        title="Xem chi tiết reader"
      >
        i
      </button>

      {/* Avatar */}
      <div className="pt-6 pb-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl relative"
          style={{
            background: reader.avatarBg,
            border: `2px solid ${isSelected ? reader.color + "80" : "rgba(255,255,255,0.1)"}`,
            boxShadow: isSelected ? `0 0 18px ${reader.color}50` : undefined,
          }}
        >
          {reader.emoji}
          {isSelected && (
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: reader.color, border: "2px solid #0d0618" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              ✓
            </motion.div>
          )}
        </div>
      </div>

      {/* Name */}
      <p
        className="font-display font-bold text-base text-center px-3 leading-snug"
        style={{ color: isSelected ? reader.color : "#d4a847" }}
      >
        {reader.name}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-3 px-3">
        {reader.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full font-body text-[10px] font-semibold"
            style={{
              background: isSelected ? `${reader.color}20` : "rgba(255,255,255,0.05)",
              color: isSelected ? reader.color : "rgba(212,168,71,0.6)",
              border: `1px solid ${isSelected ? reader.color + "45" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quote */}
      <div
        className="mx-4 mt-4 mb-4 px-3 py-2.5 rounded-xl w-[calc(100%-2rem)]"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="font-body text-[11px] italic text-center leading-relaxed"
          style={{ color: "rgba(220,210,240,0.45)" }}
        >
          &ldquo;{reader.quote}&rdquo;
        </p>
      </div>

      {/* Button */}
      <div className="px-4 pb-5 w-full">
        <div
          className="w-full py-2.5 rounded-xl font-body font-bold text-xs text-center"
          style={
            isSelected
              ? { background: `linear-gradient(135deg, ${reader.color}dd, ${reader.color}99)`, color: "#fff" }
              : { background: "linear-gradient(135deg, #c49a2a, #a07818)", color: "#1a0e00" }
          }
        >
          {isSelected ? "✓ Đã chọn" : "Chọn reader này →"}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function ReaderPicker({ selectedId, onChange }: { selectedId: string; onChange: (id: string) => void }) {
  const [detailReader, setDetailReader] = useState<TarotReader | null>(null);

  return (
    <div className="w-full max-w-2xl">
      <h2 className="font-display font-bold text-purple-deep text-xl mb-2 text-center">
        Chọn reader của bạn
      </h2>
      <p className="font-body text-purple-deep/45 text-sm mb-6 text-center">
        Mỗi reader có phong cách đọc bài riêng · Miễn phí ✨
      </p>

      <div className="grid grid-cols-2 gap-3">
        {TAROT_READERS.map((reader) => (
          <ReaderCard
            key={reader.id}
            reader={reader}
            isSelected={reader.id === selectedId}
            onSelect={() => onChange(reader.id)}
            onDetail={() => setDetailReader(reader)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.p
            className="text-center font-body text-sm mt-4 italic"
            style={{ color: "rgba(100,60,160,0.55)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {(() => {
              const r = TAROT_READERS.find((x) => x.id === selectedId);
              return r ? <>{r.emoji} {r.tagline}</> : null;
            })()}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {detailReader && (
          <ReaderDetailModal
            reader={detailReader}
            isSelected={detailReader.id === selectedId}
            onClose={() => setDetailReader(null)}
            onSelect={() => onChange(detailReader.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
