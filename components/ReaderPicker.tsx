"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TAROT_READERS, type TarotReader } from "@/data/tarotReaders";

interface ReaderPickerProps {
  selectedId: string;
  onChange: (id: string) => void;
}

function ReaderCard({
  reader,
  isSelected,
  onSelect,
}: {
  reader: TarotReader;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col rounded-3xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "linear-gradient(160deg, #0e0818 0%, #160d2a 60%, #0a0612 100%)",
        border: isSelected
          ? `1.5px solid ${reader.color}`
          : "1.5px solid rgba(255,255,255,0.08)",
        boxShadow: isSelected
          ? `0 0 32px ${reader.color}40, 0 8px 40px rgba(0,0,0,0.6)`
          : hovered
          ? "0 8px 32px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.4)",
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onSelect}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Selected glow overlay */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${reader.color}18 0%, transparent 70%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${reader.color}, transparent)`
            : "transparent",
        }}
      />

      {/* Avatar section */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        {/* Avatar circle */}
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl"
            style={{
              background: reader.avatarBg,
              border: isSelected
                ? `2px solid ${reader.color}90`
                : "2px solid rgba(255,255,255,0.12)",
              boxShadow: isSelected ? `0 0 20px ${reader.color}60` : undefined,
            }}
          >
            {reader.emoji}
          </div>
          {/* Selected badge */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: reader.color, border: "2px solid #0e0818" }}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                ✓
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Name */}
        <h3
          className="font-display font-bold text-lg mt-3 text-center leading-tight"
          style={{
            color: isSelected ? reader.color : "#d4a847",
            textShadow: isSelected ? `0 0 20px ${reader.color}60` : "0 0 12px rgba(212,168,71,0.3)",
          }}
        >
          {reader.name}
        </h3>

        {/* Experience */}
        <p className="font-body text-xs mt-1" style={{ color: "rgba(212,168,71,0.5)" }}>
          ★ {reader.experience}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {reader.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full font-body text-[11px] font-semibold"
              style={{
                background: isSelected ? `${reader.color}22` : "rgba(255,255,255,0.06)",
                color: isSelected ? reader.color : "rgba(212,168,71,0.7)",
                border: `1px solid ${isSelected ? reader.color + "50" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Strengths */}
      <div className="px-4 py-4 flex flex-col gap-2">
        <p
          className="font-body text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: isSelected ? reader.color : "rgba(212,168,71,0.6)" }}
        >
          Điểm mạnh:
        </p>
        {reader.strengths.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span style={{ color: isSelected ? reader.color : "rgba(212,168,71,0.5)" }} className="text-xs mt-0.5 shrink-0">✦</span>
            <p className="font-body text-xs leading-relaxed" style={{ color: "rgba(220,210,240,0.7)" }}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        className="mx-4 mb-4 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="font-body text-xs italic leading-relaxed" style={{ color: "rgba(220,210,240,0.5)" }}>
          <span style={{ color: "rgba(212,168,71,0.4)" }}>&ldquo;&nbsp;</span>
          {reader.quote}
          <span style={{ color: "rgba(212,168,71,0.4)" }}>&nbsp;&rdquo;</span>
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Specialties */}
      <div className="px-4 py-4 flex flex-col gap-2">
        {reader.specialties.map((s, i) => (
          <p key={i} className="font-body text-xs" style={{ color: "rgba(220,210,240,0.45)" }}>
            {s}
          </p>
        ))}
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-5">
        <motion.button
          className="w-full py-3 rounded-2xl font-body font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={
            isSelected
              ? {
                  background: `linear-gradient(135deg, ${reader.color}, ${reader.color}cc)`,
                  color: "#fff",
                  boxShadow: `0 4px 20px ${reader.color}50`,
                }
              : {
                  background: "linear-gradient(135deg, #d4a847, #b8860b)",
                  color: "#1a0e00",
                }
          }
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>✓ Đã chọn reader này</>
          ) : (
            <>Chọn reader này →</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ReaderPicker({ selectedId, onChange }: ReaderPickerProps) {
  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-purple-deep text-xl">
          Chọn reader của bạn
        </h2>
        <p className="font-body text-purple-deep/50 text-sm mt-1">
          Mỗi reader có phong cách đọc bài khác nhau — hoàn toàn miễn phí ✨
        </p>
      </div>

      {/* Cards grid — horizontal scroll on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TAROT_READERS.map((reader) => (
          <ReaderCard
            key={reader.id}
            reader={reader}
            isSelected={reader.id === selectedId}
            onSelect={() => onChange(reader.id)}
          />
        ))}
      </div>

      {/* Selected reader hint */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {(() => {
              const r = TAROT_READERS.find((x) => x.id === selectedId);
              return r ? (
                <p className="font-body text-sm" style={{ color: "rgba(100,60,160,0.6)" }}>
                  {r.emoji} <strong style={{ color: r.color }}>{r.name}</strong> sẽ đọc bài cho bạn — <em>{r.tagline}</em>
                </p>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
