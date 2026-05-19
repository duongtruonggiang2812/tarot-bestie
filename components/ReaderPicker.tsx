"use client";

import { motion } from "framer-motion";
import { TAROT_READERS, type TarotReader } from "@/data/tarotReaders";

interface ReaderPickerProps {
  selectedId: string;
  onChange: (id: string) => void;
}

export default function ReaderPicker({ selectedId, onChange }: ReaderPickerProps) {
  return (
    <div className="w-full max-w-2xl">
      <h2 className="font-display font-bold text-purple-deep text-xl mb-5 text-center">
        Chọn reader của bạn
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {TAROT_READERS.map((reader: TarotReader) => {
          const isSelected = reader.id === selectedId;
          return (
            <motion.button
              key={reader.id}
              onClick={() => onChange(reader.id)}
              className="relative rounded-2xl p-4 text-left border-2 transition-all"
              style={{
                borderColor: isSelected ? reader.color : "rgba(255,255,255,0.5)",
                background: isSelected
                  ? `${reader.color}18`
                  : "rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
                boxShadow: isSelected ? `0 4px 24px ${reader.color}30` : undefined,
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: reader.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  ✓
                </motion.div>
              )}

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2.5"
                style={{
                  background: isSelected ? `${reader.color}22` : "rgba(255,255,255,0.6)",
                  border: `1.5px solid ${isSelected ? reader.color + "55" : "rgba(255,255,255,0.6)"}`,
                }}
              >
                {reader.emoji}
              </div>

              {/* Info */}
              <p
                className="font-display font-bold text-sm leading-tight mb-1"
                style={{ color: isSelected ? reader.color : "#3b1f6b" }}
              >
                {reader.name}
              </p>
              <p
                className="font-body text-xs leading-snug"
                style={{ color: isSelected ? `${reader.color}cc` : "rgba(59,31,107,0.5)" }}
              >
                {reader.description}
              </p>

              {/* Tagline pill */}
              {isSelected && (
                <motion.div
                  className="mt-2 inline-block px-2 py-0.5 rounded-full font-body text-[10px] font-semibold"
                  style={{ background: `${reader.color}20`, color: reader.color }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {reader.tagline}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
