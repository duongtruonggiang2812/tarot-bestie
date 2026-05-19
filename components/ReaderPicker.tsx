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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg, #fff 0%, #f3e8ff 100%)" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-purple-deep/20" />
        </div>

        {/* Close (desktop) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-sm text-purple-deep/30 hover:text-purple-deep/60 hover:bg-purple-deep/8 transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md"
              style={{ background: reader.avatarBg }}
            >
              {reader.emoji}
            </div>
            <div>
              <p className="font-display font-bold text-purple-deep text-lg leading-tight">{reader.name}</p>
              <p className="font-body text-purple-deep/50 text-xs mt-0.5 italic">{reader.tagline}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {reader.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full font-body text-[10px] font-semibold"
                    style={{
                      background: `${reader.color}18`,
                      color: reader.color,
                      border: `1px solid ${reader.color}35`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-purple-deep/8" />

          {/* Strengths */}
          <div>
            <p className="font-body text-[11px] font-bold text-purple-deep/40 uppercase tracking-widest mb-2">Điểm mạnh</p>
            <div className="flex flex-col gap-2">
              {reader.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 shrink-0" style={{ color: reader.color }}>✦</span>
                  <p className="font-body text-sm text-purple-deep/75 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div
            className="px-4 py-3 rounded-2xl"
            style={{ background: `${reader.color}0f`, border: `1px solid ${reader.color}25` }}
          >
            <p className="font-body text-sm italic text-center text-purple-deep/60 leading-relaxed">
              &ldquo;{reader.quote}&rdquo;
            </p>
          </div>

          {/* Specialties */}
          <div>
            <p className="font-body text-[11px] font-bold text-purple-deep/40 uppercase tracking-widest mb-2">Chuyên đọc</p>
            <div className="flex flex-col gap-1">
              {reader.specialties.map((s, i) => (
                <p key={i} className="font-body text-sm text-purple-deep/55">· {s}</p>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.button
            className="w-full py-3.5 rounded-2xl font-body font-bold text-sm mt-1"
            style={
              isSelected
                ? { background: `linear-gradient(135deg, ${reader.color}, ${reader.color}bb)`, color: "#fff" }
                : { background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff" }
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
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
      className="relative rounded-2xl p-4 flex flex-col items-center gap-2.5 border-2 cursor-pointer transition-all"
      style={{
        background: isSelected ? `${reader.color}12` : "rgba(255,255,255,0.5)",
        borderColor: isSelected ? reader.color : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: isSelected ? `0 4px 20px ${reader.color}25` : "0 2px 12px rgba(0,0,0,0.06)",
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Info button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
        style={{ color: "rgba(59,31,107,0.3)", background: "rgba(59,31,107,0.06)" }}
        title="Xem chi tiết"
      >
        i
      </button>

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
        style={{
          background: reader.avatarBg,
          boxShadow: isSelected ? `0 4px 14px ${reader.color}40` : undefined,
        }}
      >
        {reader.emoji}
      </div>

      {/* Name */}
      <p
        className="font-display font-bold text-sm text-center leading-snug"
        style={{ color: isSelected ? reader.color : "#3b1f6b" }}
      >
        {reader.name}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-1">
        {reader.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full font-body text-[10px]"
            style={{
              background: isSelected ? `${reader.color}18` : "rgba(59,31,107,0.06)",
              color: isSelected ? reader.color : "rgba(59,31,107,0.5)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
            style={{ background: reader.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
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
