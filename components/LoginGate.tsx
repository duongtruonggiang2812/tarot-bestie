"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginGate() {
  return (
    <div className="min-h-screen bg-celestial flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blurred orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-lavender/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-rose/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-mint/30 blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-8 sm:p-12 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl border border-purple-mid/20"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-6xl"
        >
          🔮
        </motion.div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-purple-deep">
            Đăng nhập để xem bói
          </h1>
          <p className="font-body text-purple-deep/70 text-sm leading-relaxed">
            Vũ trụ đang chờ bestie! Đăng nhập để bắt đầu hành trình tarot của bạn ✨
          </p>
        </div>

        {/* Welcome bonus */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)" }}
        >
          <span className="text-2xl">🎁</span>
          <div className="text-left">
            <p className="font-body font-bold text-amber-800 text-sm">Tặng 20 xu miễn phí!</p>
            <p className="font-body text-amber-700 text-xs">Dành cho thành viên mới đăng ký hôm nay</p>
          </div>
          <span className="ml-auto font-display font-bold text-amber-800 text-lg">🪙 20</span>
        </motion.div>

        {/* Features list */}
        <div className="w-full flex flex-col gap-2 text-left">
          {[
            { icon: "🃏", text: "Xem bói với 78 lá Rider-Waite chuẩn" },
            { icon: "🤖", text: "AI DeepSeek đọc bài tiếng Việt Gen Z" },
            { icon: "💬", text: "Chat hỏi đáp sau khi xem" },
            { icon: "📚", text: "Lưu lịch sử 10 lần xem gần nhất" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-2">
              <span className="text-base">{f.icon}</span>
              <span className="font-body text-purple-deep/70 text-xs">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Login button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signIn("google")}
          className="w-full py-3.5 px-6 rounded-2xl font-body font-bold text-white text-sm flex items-center justify-center gap-3 shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập bằng Google
        </motion.button>

        <p className="font-body text-purple-deep/40 text-[10px]">
          Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng của Tarot Bestie
        </p>
      </motion.div>
    </div>
  );
}
