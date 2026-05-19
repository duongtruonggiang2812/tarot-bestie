"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useCoinStore, COIN_PACKAGES } from "@/store/coinStore";
import PaymentModal from "@/components/PaymentModal";

const HOW_IT_WORKS = [
  { emoji: "🎴", label: "Xào & lật bài",          cost: "Miễn phí",   free: true  },
  { emoji: "🔮", label: "Thần Bài đọc 1 lá",        cost: "2 xu",       free: false },
  { emoji: "🔮", label: "Thần Bài đọc 3 lá",        cost: "4 xu",       free: false },
  { emoji: "🔮", label: "Thần Bài đọc 5 lá",        cost: "6 xu",       free: false },
  { emoji: "💬", label: "Chat hỏi thêm bestie",    cost: "1 xu / tin", free: false },
  { emoji: "📅", label: "Điểm danh hàng ngày",     cost: "+3 xu free", free: true  },
];

const PKG_COLORS = [
  { bg: "from-slate-50 to-gray-50",     border: "border-gray-200",   btn: "from-gray-600 to-gray-700"       },
  { bg: "from-purple-50 to-fuchsia-50", border: "border-purple-300", btn: "from-purple-600 to-fuchsia-600"  },
  { bg: "from-violet-50 to-purple-50",  border: "border-violet-300", btn: "from-violet-600 to-purple-600"   },
  { bg: "from-amber-50 to-yellow-50",   border: "border-amber-300",  btn: "from-amber-500 to-orange-500"    },
];

type PaymentInfo = {
  orderCode: string; amount: number; coins: number; packageName: string;
  bankId: string; accountNo: string; accountName: string; qrUrl: string; expiresAt: string;
};

export default function CoinsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { coins } = useCoinStore();

  const [loadingId, setLoadingId]     = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [toast, setToast]             = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleBuy = async (pkg: typeof COIN_PACKAGES[0]) => {
    if (!session) {
      showToast("Bạn cần đăng nhập trước để mua xu nhé!");
      setTimeout(() => signIn("google"), 1500);
      return;
    }

    setLoadingId(pkg.id);
    try {
      const res = await fetch("/api/payment/sepay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Không thể tạo đơn, thử lại nhé!"); return; }
      setPaymentInfo(data);
    } catch {
      showToast("Lỗi kết nối, thử lại nhé!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-celestial relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
        {["8%","25%","50%","70%","88%"].map((left, i) => (
          <motion.span key={i} className="absolute text-lg select-none"
            style={{ left, top: `${8 + i * 16}%` }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}>✨</motion.span>
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/40 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-purple-deep/70 font-body font-semibold text-sm hover:text-purple-deep transition-colors">
            ← Quay lại
          </button>
          <span className="font-display font-bold text-purple-deep">🪙 Nạp Xu</span>
          {session && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-purple-mid/30 font-body font-bold text-sm text-purple-deep shadow-sm">
              🪙 {coins}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 relative z-10 pb-20">

        {/* Balance card */}
        <motion.div
          className="rounded-3xl p-6 mb-6 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)" }}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <p className="font-body text-white/70 text-sm mb-1 relative z-10">Số xu hiện tại</p>
          <p className="font-display text-5xl font-bold text-white relative z-10">{coins}</p>
          <p className="font-body text-white/60 text-xs mt-1 relative z-10">🪙 xu</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 relative z-10">
            <span className="text-xs font-body text-white/80">📅 Điểm danh hàng ngày = +3 xu miễn phí</span>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-6 shadow-sm"
          style={{ background: "linear-gradient(160deg,#fff 0%,#faf5ff 100%)" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="px-5 pt-4 pb-2">
            <h2 className="font-display font-bold text-purple-deep text-base">Xu dùng để làm gì? 🤔</h2>
          </div>
          <div className="px-2 pb-2">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-deep/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{item.emoji}</span>
                  <span className="font-body text-purple-deep/80 text-sm">{item.label}</span>
                </div>
                <span className={`font-body font-bold text-sm px-2.5 py-0.5 rounded-full ${
                  item.free ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                }`}>{item.cost}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Packages */}
        <h2 className="font-display font-bold text-purple-deep text-xl mb-4 text-center">Chọn gói 👇</h2>
        <div className="flex flex-col gap-3 mb-5">
          {COIN_PACKAGES.map((pkg, i) => {
            const colors = PKG_COLORS[i] ?? PKG_COLORS[0];
            const isLoading = loadingId === pkg.id;
            return (
              <motion.div key={pkg.id}
                className={`relative rounded-2xl border-2 overflow-hidden bg-gradient-to-r ${colors.bg} ${colors.border} ${pkg.popular ? "shadow-lg shadow-purple-mid/20" : "shadow-sm"}`}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                whileHover={{ scale: 1.015, y: -2 }} whileTap={{ scale: 0.99 }}
              >
                {pkg.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-body text-white uppercase tracking-wide"
                      style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}>🔥 Phổ biến</span>
                  </div>
                )}
                <div className="flex items-center p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-purple-deep text-base leading-tight">{pkg.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-body text-purple-deep/70 text-sm font-semibold">🪙 {pkg.coins} xu</span>
                      <span className="text-purple-deep/30 text-xs">·</span>
                      <span className="font-body text-purple-deep/50 text-xs">~{Math.floor(pkg.coins / 4)} lần đọc bài</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-display font-bold text-purple-deep text-lg leading-none">{pkg.price}</p>
                    <button
                      onClick={() => handleBuy(pkg)}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-body font-bold text-sm bg-gradient-to-r ${colors.btn} shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 min-w-[88px] justify-center`}
                    >
                      {isLoading
                        ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                        : "Mua ngay"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SePay badge */}
        <motion.div
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl mb-6"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.8)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <span className="text-lg">🏦</span>
          <p className="font-body text-purple-deep/60 text-xs text-center">
            Thanh toán qua <strong>chuyển khoản ngân hàng</strong> · Tự động xác nhận qua <strong className="text-purple-deep/80">SePay</strong>
          </p>
        </motion.div>

        <div className="text-center">
          <button onClick={() => router.back()}
            className="font-body text-purple-deep/40 hover:text-purple-deep text-sm transition-colors">
            ← Quay lại trải bài
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentInfo && (
          <PaymentModal
            info={paymentInfo}
            onClose={() => setPaymentInfo(null)}
            onSuccess={(earnedCoins) => {
              showToast(`+${earnedCoins} xu đã vào tài khoản! 🪙`);
              setTimeout(() => setPaymentInfo(null), 3000);
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl shadow-xl font-body text-sm font-semibold text-white max-w-[320px] text-center leading-snug"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
