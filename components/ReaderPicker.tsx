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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg, #fff 0%, #f3e8ff 100%)" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-purple-deep/15" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-sm text-purple-deep/30 hover:text-purple-deep/60 transition-colors"
        >
          ✕
        </button>

        <div className="px-6 pt-5 pb-7 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
              style={{ background: reader.avatarBg }}
            >
              {reader.emoji}
            </div>
            <div>
              <p className="font-display font-bold text-purple-deep text-lg leading-tight">{reader.name}</p>
              <p className="font-body text-xs text-purple-deep/45 mt-0.5 italic">{reader.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {reader.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full font-body text-[10px] font-semibold"
                    style={{ background: `${reader.color}15`, color: reader.color, border: `1px solid ${reader.color}30` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-purple-deep/8" />

          {/* Strengths */}
          <div>
            <p className="font-body text-[11px] font-bold text-purple-deep/35 uppercase tracking-widest mb-2.5">Điểm mạnh</p>
            <div className="flex flex-col gap-2">
              {reader.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 shrink-0" style={{ color: reader.color }}>✦</span>
                  <p className="font-body text-sm text-purple-deep/70 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="px-4 py-3 rounded-2xl"
            style={{ background: `${reader.color}0d`, border: `1px solid ${reader.color}22` }}>
            <p className="font-body text-sm italic text-center leading-relaxed" style={{ color: reader.color + "bb" }}>
              &ldquo;{reader.quote}&rdquo;
            </p>
          </div>

          {/* Specialties */}
          <div>
            <p className="font-body text-[11px] font-bold text-purple-deep/35 uppercase tracking-widest mb-2.5">Chuyên đọc</p>
            <div className="flex flex-col gap-1.5">
              {reader.specialties.map((s, i) => (
                <p key={i} className="font-body text-sm text-purple-deep/55">· {s}</p>
              ))}
            </div>
          </div>

          <motion.button
            className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white mt-1"
            style={{ background: `linear-gradient(135deg, ${reader.color}, ${reader.color}cc)` }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { onSelect(); onClose(); }}
          >
            {isSelected ? `✓ Đang chọn ${reader.name}` : `Chọn ${reader.name} →`}
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
      onClick={onSelect}
      className="relative flex items-center gap-4 rounded-2xl p-4 cursor-pointer overflow-hidden"
      style={{
        background: isSelected ? `${reader.color}08` : "rgba(255,255,255,0.7)",
        border: `2px solid ${isSelected ? reader.color + "cc" : "rgba(255,255,255,0.7)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: isSelected
          ? `0 4px 24px ${reader.color}20, 0 1px 8px rgba(0,0,0,0.04)`
          : "0 2px 12px rgba(0,0,0,0.05)",
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Avatar — app icon style */}
      <div className="relative shrink-0">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
          style={{ background: reader.avatarBg }}
        >
          {reader.emoji}
        </div>
        {/* Floating sparkles around avatar */}
        <span className="absolute -top-1 -right-1 text-[10px] opacity-60"
          style={{ color: reader.color }}>✦</span>
        <span className="absolute -bottom-0.5 -left-1 text-[8px] opacity-40"
          style={{ color: reader.color }}>✦</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <p
          className="font-display font-bold text-base leading-tight"
          style={{ color: isSelected ? reader.color : "#3b1f6b" }}
        >
          {reader.name}
        </p>

        {/* Divider sparkle */}
        <div className="flex items-center gap-1 my-1.5">
          <span className="text-[10px]" style={{ color: reader.color + "80" }}>✦</span>
        </div>

        {/* Quote */}
        <p
          className="font-body text-xs italic leading-snug"
          style={{ color: "rgba(59,31,107,0.5)" }}
        >
          &ldquo;{reader.quote}&rdquo;
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-2.5">
          {reader.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full font-body text-[11px]"
              style={{
                background: isSelected ? `${reader.color}15` : "rgba(59,31,107,0.06)",
                color: isSelected ? reader.color : "rgba(59,31,107,0.45)",
                border: `1px solid ${isSelected ? reader.color + "30" : "transparent"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Info button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors"
        style={{
          background: isSelected ? `${reader.color}18` : "rgba(59,31,107,0.07)",
          color: isSelected ? reader.color : "rgba(59,31,107,0.35)",
          border: `1px solid ${isSelected ? reader.color + "30" : "rgba(59,31,107,0.1)"}`,
        }}
      >
        i
      </button>

      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -top-0 -right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
            style={{ background: reader.color, top: -8, right: -8 }}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function ReaderPicker({ selectedId, onChange }: { selectedId: string; onChange: (id: string) => void }) {
  const [detailReader, setDetailReader] = useState<TarotReader | null>(null);

  return (
    <div className="w-full max-w-2xl">
      <h2 className="font-display font-bold text-purple-deep text-xl mb-1.5 text-center">
        Chọn reader của bạn
      </h2>
      <p className="font-body text-purple-deep/45 text-sm mb-5 text-center">
        Mỗi reader có phong cách đọc bài riêng · Miễn phí ✨
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
