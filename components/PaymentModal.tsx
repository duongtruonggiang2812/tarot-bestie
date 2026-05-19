"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoinStore } from "@/store/coinStore";

export interface PaymentInfo {
  orderCode:   string;
  amount:      number;
  coins:       number;
  packageName: string;
  bankId:      string;
  accountNo:   string;
  accountName: string;
  qrUrl:       string;
  expiresAt:   string;
}

type PayStatus = "pending" | "success" | "expired" | "wrong_amount";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function useCountdown(expiresAt: string) {
  const calc = () => Math.max(0, Math.floor((+new Date(expiresAt) - Date.now()) / 1000));
  const [sec, setSec] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setSec(calc), 1000);
    return () => clearInterval(id);
  });
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return { label: `${mm}:${ss}`, expired: sec === 0 };
}

// ── copy row ─────────────────────────────────────────────────────────────────
function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-deep/5 last:border-0">
      <span className="font-body text-xs text-purple-deep/45 shrink-0 mr-3 w-28">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <span className={`font-body text-sm font-semibold text-purple-deep truncate ${mono ? "font-mono tracking-wide" : ""}`}>
          {value}
        </span>
        <button
          onClick={copy}
          className="shrink-0 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all min-w-[48px] text-center"
          style={{
            background: copied ? "#059669" : "rgba(124,58,237,0.1)",
            color: copied ? "#fff" : "#7c3aed",
          }}
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function PaymentModal({
  info,
  onClose,
  onSuccess,
}: {
  info: PaymentInfo;
  onClose: () => void;
  onSuccess: (coins: number) => void;
}) {
  const { addCoins } = useCoinStore();
  const [status, setStatus] = useState<PayStatus>("pending");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { label: countdown, expired } = useCountdown(info.expiresAt);

  const stopPolling = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const poll = useCallback(async () => {
    try {
      const res  = await fetch(`/api/payment/sepay/status?orderCode=${info.orderCode}`);
      const data = await res.json() as { status: PayStatus; coins?: number };

      if (data.status === "success") {
        stopPolling();
        setStatus("success");
        addCoins(info.coins);
        onSuccess(info.coins);
      } else if (data.status !== "pending") {
        stopPolling();
        setStatus(data.status);
      }
    } catch { /* mạng lỗi → thử lại lần sau */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.orderCode, info.coins]);

  useEffect(() => {
    timerRef.current = setInterval(poll, 4000);
    return stopPolling;
  }, [poll]);

  useEffect(() => {
    if (expired && status === "pending") { stopPolling(); setStatus("expired"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Backdrop — chỉ cho đóng khi đã xong */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={status !== "pending" ? onClose : undefined}
      />

      <motion.div
        className="relative w-full sm:max-w-[400px] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg,#fff 0%,#faf5ff 100%)" }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        {/* pill */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-purple-deep/15" />
        </div>

        <AnimatePresence mode="wait">

          {/* ── PENDING ───────────────────────────────────────────────────── */}
          {status === "pending" && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div>
                  <h3 className="font-display font-bold text-purple-deep text-lg leading-tight">
                    Thanh toán {info.packageName}
                  </h3>
                  <p className="font-body text-purple-deep/50 text-sm mt-0.5">
                    🪙 {info.coins} xu &nbsp;·&nbsp; {formatVND(info.amount)}
                  </p>
                </div>
                {/* Countdown */}
                <div className="flex flex-col items-center px-3 py-2 rounded-2xl shrink-0"
                  style={{ background: "rgba(124,58,237,0.07)" }}>
                  <span className="font-display font-bold text-purple-deep text-xl leading-none">{countdown}</span>
                  <span className="font-body text-purple-deep/35 text-[10px] mt-0.5">còn lại</span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 px-5 mb-3">
                {["Quét QR", "Chuyển khoản", "Nhận xu"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>{i + 1}</div>
                      <span className="font-body text-[11px] text-purple-deep/60">{s}</span>
                    </div>
                    {i < 2 && <span className="text-purple-deep/20 text-xs">›</span>}
                  </div>
                ))}
              </div>

              {/* QR */}
              <div className="flex justify-center px-5 mb-4">
                <div className="rounded-2xl border-2 border-purple-mid/20 p-2 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={info.qrUrl} alt="QR" className="w-52 h-52 object-contain rounded-xl" />
                </div>
              </div>

              {/* Bank info */}
              <div className="mx-5 rounded-2xl overflow-hidden border border-purple-deep/8 mb-3"
                style={{ background: "rgba(124,58,237,0.03)" }}>
                <div className="px-4 py-2 border-b border-purple-deep/6">
                  <p className="font-body text-[11px] text-purple-deep/35 uppercase tracking-widest">Thông tin chuyển khoản</p>
                </div>
                <CopyRow label="Ngân hàng"    value={info.bankId} />
                <CopyRow label="Số tài khoản" value={info.accountNo} mono />
                <CopyRow label="Chủ tài khoản" value={info.accountName} />
                <CopyRow label="Số tiền"       value={formatVND(info.amount)} />
                <CopyRow label="Nội dung CK"   value={info.orderCode} mono />
              </div>

              {/* Warning */}
              <div className="mx-5 mb-4 flex items-start gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)" }}>
                <span className="text-sm shrink-0">⚠️</span>
                <p className="font-body text-xs text-amber-800/75 leading-relaxed">
                  Nhập <strong>đúng nội dung</strong>{" "}
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{info.orderCode}</span>
                  {" "}— hệ thống tự xác nhận sau 1–2 phút.
                </p>
              </div>

              {/* Polling indicator */}
              <div className="flex items-center justify-center gap-2 pb-5">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-purple-mid"
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <p className="font-body text-xs text-purple-deep/35">Đang chờ xác nhận thanh toán...</p>
              </div>
            </motion.div>
          )}

          {/* ── SUCCESS ───────────────────────────────────────────────────── */}
          {status === "success" && (
            <motion.div key="success" className="flex flex-col items-center gap-5 px-6 py-10 text-center"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
                style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              >✓</motion.div>
              <div>
                <h3 className="font-display font-bold text-purple-deep text-2xl">Thanh toán thành công!</h3>
                <p className="font-body text-purple-deep/55 text-sm mt-1">Xu đã được cộng vào tài khoản ✨</p>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.08))" }}>
                <span className="text-3xl">🪙</span>
                <span className="font-display font-bold text-purple-deep text-3xl">+{info.coins}</span>
                <span className="font-body text-purple-deep/60 text-sm">xu</span>
              </div>
              <motion.button
                className="w-full py-3.5 rounded-2xl font-body font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
              >
                Tuyệt! Tiếp tục trải bài 🔮
              </motion.button>
            </motion.div>
          )}

          {/* ── EXPIRED ───────────────────────────────────────────────────── */}
          {(status === "expired" || status === "wrong_amount") && (
            <motion.div key="expired" className="flex flex-col items-center gap-4 px-6 py-10 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-5xl">{status === "expired" ? "⏰" : "❌"}</div>
              <h3 className="font-display font-bold text-purple-deep text-xl">
                {status === "expired" ? "Đơn hàng đã hết hạn" : "Số tiền không khớp"}
              </h3>
              <p className="font-body text-purple-deep/55 text-sm leading-relaxed">
                {status === "expired"
                  ? "Lệnh thanh toán chỉ có hiệu lực 15 phút. Bạn có thể tạo lại đơn mới."
                  : `Vui lòng chuyển đúng ${formatVND(info.amount)} và liên hệ hỗ trợ nếu đã chuyển sai.`}
              </p>
              <button onClick={onClose}
                className="w-full py-3 rounded-2xl font-body font-semibold text-purple-deep/60 text-sm border border-purple-deep/15 hover:bg-purple-deep/5 transition-colors">
                Đóng
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
