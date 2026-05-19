"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoinStore } from "@/store/coinStore";

interface PaymentInfo {
  orderCode: string;
  amount: number;
  coins: number;
  packageName: string;
  bankId: string;
  accountNo: string;
  accountName: string;
  qrUrl: string;
  expiresAt: string;
}

interface PaymentModalProps {
  info: PaymentInfo;
  onClose: () => void;
  onSuccess: (coins: number) => void;
}

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

function useCountdown(expiresAt: string) {
  const [seconds, setSeconds] = useState(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, expired: seconds === 0 };
}

export default function PaymentModal({ info, onClose, onSuccess }: PaymentModalProps) {
  const { addCoins } = useCoinStore();
  const [copied, setCopied] = useState<"code" | "account" | null>(null);
  const [status, setStatus] = useState<"pending" | "success" | "expired" | "error">("pending");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { display: countdown, expired } = useCountdown(info.expiresAt);

  const copy = (text: string, type: "code" | "account") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/payment/sepay/status?orderCode=${info.orderCode}`);
      const data = await res.json();
      if (data.status === "success") {
        setStatus("success");
        addCoins(info.coins);
        onSuccess(info.coins);
        if (pollingRef.current) clearInterval(pollingRef.current);
      } else if (data.status === "expired") {
        setStatus("expired");
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    } catch { /* ignore */ }
  }, [info.orderCode, info.coins, addCoins, onSuccess]);

  // Poll every 4 seconds
  useEffect(() => {
    pollingRef.current = setInterval(pollStatus, 4000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [pollStatus]);

  // Stop polling when expired
  useEffect(() => {
    if (expired && status === "pending") {
      setStatus("expired");
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [expired, status]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={status === "pending" ? undefined : onClose} />

      <motion.div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg, #fff 0%, #faf5ff 100%)" }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-purple-deep/15" />
        </div>

        {/* ── SUCCESS STATE ── */}
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              key="success"
              className="flex flex-col items-center gap-4 px-6 py-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✓
              </motion.div>
              <h3 className="font-display font-bold text-purple-deep text-2xl">Thanh toán thành công!</h3>
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #7c3aed15, #a855f715)" }}>
                <span className="text-2xl">🪙</span>
                <span className="font-display font-bold text-purple-deep text-xl">+{info.coins} xu</span>
              </div>
              <p className="font-body text-purple-deep/60 text-sm text-center">
                Xu đã được cộng vào tài khoản của bạn ✨
              </p>
              <motion.button
                className="w-full py-3.5 rounded-2xl font-body font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
              >
                Tuyệt! Tiếp tục trải bài 🔮
              </motion.button>
            </motion.div>
          )}

          {/* ── EXPIRED STATE ── */}
          {status === "expired" && (
            <motion.div
              key="expired"
              className="flex flex-col items-center gap-4 px-6 py-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <div className="text-5xl">⏰</div>
              <h3 className="font-display font-bold text-purple-deep text-xl">Đơn hàng đã hết hạn</h3>
              <p className="font-body text-purple-deep/55 text-sm text-center">
                Lệnh thanh toán chỉ có hiệu lực 15 phút. Bạn có thể tạo lại đơn mới.
              </p>
              <button onClick={onClose}
                className="w-full py-3 rounded-2xl font-body font-bold text-purple-deep/60 text-sm border border-purple-deep/20 hover:bg-purple-deep/5 transition-colors">
                Đóng
              </button>
            </motion.div>
          )}

          {/* ── PENDING STATE ── */}
          {status === "pending" && (
            <motion.div key="pending" className="px-5 pb-6 pt-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-purple-deep text-lg leading-tight">
                    Thanh toán {info.packageName}
                  </h3>
                  <p className="font-body text-purple-deep/50 text-xs mt-0.5">
                    🪙 {info.coins} xu · {formatVND(info.amount)}
                  </p>
                </div>
                {/* Countdown */}
                <div className="flex flex-col items-center px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(124,58,237,0.08)" }}>
                  <span className="font-display font-bold text-purple-deep text-lg leading-none">{countdown}</span>
                  <span className="font-body text-purple-deep/40 text-[10px]">còn lại</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="rounded-2xl overflow-hidden border-2 border-purple-mid/20 p-1 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={info.qrUrl} alt="QR thanh toán" className="w-48 h-48 object-contain" />
                </div>
              </div>

              {/* Bank info */}
              <div className="rounded-2xl overflow-hidden border border-purple-deep/10 mb-4"
                style={{ background: "rgba(124,58,237,0.04)" }}>
                <div className="px-4 py-2 border-b border-purple-deep/8">
                  <p className="font-body text-[11px] text-purple-deep/40 uppercase tracking-widest">Thông tin chuyển khoản</p>
                </div>
                {[
                  { label: "Ngân hàng", value: info.bankId, copyKey: null },
                  { label: "Số tài khoản", value: info.accountNo, copyKey: "account" as const },
                  { label: "Chủ tài khoản", value: info.accountName, copyKey: null },
                  { label: "Số tiền", value: formatVND(info.amount), copyKey: null },
                  { label: "Nội dung CK", value: info.orderCode, copyKey: "code" as const, highlight: true },
                ].map(({ label, value, copyKey, highlight }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-purple-deep/6 last:border-0">
                    <span className="font-body text-xs text-purple-deep/50 shrink-0 mr-3">{label}</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-body text-sm font-semibold truncate ${highlight ? "text-purple-deep" : "text-purple-deep/80"}`}>
                        {value}
                      </span>
                      {copyKey && (
                        <button
                          onClick={() => copy(value, copyKey)}
                          className="shrink-0 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all"
                          style={{
                            background: copied === copyKey ? "#059669" : "rgba(124,58,237,0.12)",
                            color: copied === copyKey ? "#fff" : "#7c3aed",
                          }}
                        >
                          {copied === copyKey ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-3"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <span className="text-sm shrink-0 mt-0.5">⚠️</span>
                <p className="font-body text-xs text-amber-700/80 leading-relaxed">
                  Nhập <strong>đúng nội dung</strong> <span className="font-mono bg-amber-100 px-1 rounded">{info.orderCode}</span> khi chuyển khoản — hệ thống tự động xác nhận sau 1–2 phút.
                </p>
              </div>

              {/* Polling indicator */}
              <div className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-purple-mid"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="font-body text-xs text-purple-deep/40">Đang chờ xác nhận thanh toán...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
