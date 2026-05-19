"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface UserInfo {
  name: string;
  birthdate: string; // "YYYY-MM-DD"
  gender: "male" | "female" | "other" | "";
}

const STORAGE_KEY = "tarot-user-info";

export function getUserInfo(): UserInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserInfo(info: UserInfo) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}

const GENDER_OPTIONS: { value: UserInfo["gender"]; label: string; emoji: string }[] = [
  { value: "female", label: "Nữ",   emoji: "👩" },
  { value: "male",   label: "Nam",  emoji: "👨" },
  { value: "other",  label: "Khác", emoji: "🧑" },
];

interface Props {
  isOpen: boolean;
  onDone: (info: UserInfo | null) => void;
}

export default function BirthInfoModal({ isOpen, onDone }: Props) {
  const [name, setName]           = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender]       = useState<UserInfo["gender"]>("");

  const handleSubmit = () => {
    const info: UserInfo = { name: name.trim(), birthdate, gender };
    saveUserInfo(info);
    onDone(info);
  };

  const handleSkip = () => {
    saveUserInfo({ name: "", birthdate: "", gender: "" });
    onDone(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            className="relative rounded-3xl p-7 max-w-sm w-full flex flex-col gap-5 shadow-2xl"
            style={{ background: "linear-gradient(160deg, #fff 0%, #f3e8ff 100%)" }}
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="text-center">
              <div className="text-4xl mb-2">🔮</div>
              <h2 className="font-display font-bold text-purple-deep text-xl leading-snug">
                Vũ trụ muốn biết thêm về bạn
              </h2>
              <p className="font-body text-purple-deep/60 text-sm mt-1.5 leading-relaxed">
                Tên, ngày sinh và giới tính giúp AI đọc bài chính xác và cá nhân hoá hơn cho bạn ✨
              </p>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="font-body text-xs font-bold text-purple-deep/60 uppercase tracking-wider mb-1.5 block">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Minh Anh, Gia Bảo..."
                  maxLength={40}
                  className="w-full rounded-xl px-4 py-3 font-body text-sm text-purple-deep placeholder-purple-deep/30 outline-none border-2 transition-all bg-white/70"
                  style={{ borderColor: name ? "rgba(167,139,250,0.7)" : "rgba(229,231,235,1)" }}
                />
              </div>

              <div>
                <label className="font-body text-xs font-bold text-purple-deep/60 uppercase tracking-wider mb-1.5 block">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl px-4 py-3 font-body text-sm text-purple-deep outline-none border-2 transition-all bg-white/70"
                  style={{ borderColor: birthdate ? "rgba(167,139,250,0.7)" : "rgba(229,231,235,1)" }}
                />
              </div>

              <div>
                <label className="font-body text-xs font-bold text-purple-deep/60 uppercase tracking-wider mb-1.5 block">
                  Giới tính
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setGender(opt.value)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 font-body text-sm font-semibold transition-all"
                      style={{
                        borderColor: gender === opt.value ? "rgba(124,58,237,0.7)" : "rgba(229,231,235,1)",
                        background: gender === opt.value ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.7)",
                        color: gender === opt.value ? "#7c3aed" : "rgba(107,114,128,1)",
                      }}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Zodiac hint */}
            {birthdate && (
              <motion.div
                className="rounded-xl px-4 py-2.5 text-center"
                style={{ background: "rgba(167,139,250,0.12)" }}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-body text-sm text-purple-deep/70">
                  {getZodiacEmoji(birthdate)} {getZodiacName(birthdate)}
                </p>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSubmit}
                disabled={!name.trim() && !birthdate}
                className="w-full py-3.5 rounded-2xl font-body font-bold text-white text-sm transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                ✨ Bắt đầu trải bài
              </button>
              <button
                onClick={handleSkip}
                className="w-full py-2.5 font-body text-sm text-purple-deep/40 hover:text-purple-deep/70 transition-colors"
              >
                Bỏ qua, trải bài không cần thông tin
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Zodiac helpers ────────────────────────────────────────────────────────────
function getZodiacName(dateStr: string): string {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "Bạch Dương";
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "Kim Ngưu";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "Song Tử";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "Cự Giải";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "Sư Tử";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "Xử Nữ";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Thiên Bình";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Bọ Cạp";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Nhân Mã";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "Ma Kết";
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "Bảo Bình";
  return "Song Ngư";
}

function getZodiacEmoji(dateStr: string): string {
  const name = getZodiacName(dateStr);
  const map: Record<string, string> = {
    "Bạch Dương": "♈", "Kim Ngưu": "♉", "Song Tử": "♊", "Cự Giải": "♋",
    "Sư Tử": "♌", "Xử Nữ": "♍", "Thiên Bình": "♎", "Bọ Cạp": "♏",
    "Nhân Mã": "♐", "Ma Kết": "♑", "Bảo Bình": "♒", "Song Ngư": "♓",
  };
  return map[name] ?? "⭐";
}
