"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <motion.div
      onClick={onSelect}
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
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Top glow line */}
      <div
        className="w-full h-0.5"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, transparent, ${reader.color}cc, transparent)`
            : "transparent",
        }}
      />

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

      {/* Experience */}
      <p className="font-body text-[11px] mt-1" style={{ color: "rgba(212,168,71,0.45)" }}>
        ★ {reader.experience}
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
      <div className="mx-4 mt-4 mb-4 px-3 py-2.5 rounded-xl w-[calc(100%-2rem)]"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="font-body text-[11px] italic text-center leading-relaxed"
          style={{ color: "rgba(220,210,240,0.45)" }}>
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

export default function ReaderPicker({ selectedId, onChange }: ReaderPickerProps) {
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
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.p
            className="text-center font-body text-sm mt-4"
            style={{ color: "rgba(100,60,160,0.55)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {(() => {
              const r = TAROT_READERS.find((x) => x.id === selectedId);
              return r ? <><em>{r.emoji} {r.tagline}</em></> : null;
            })()}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
