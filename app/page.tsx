"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleEffect from "@/components/ParticleEffect";
import Header from "@/components/Header";
import HistoryPanel from "@/components/HistoryPanel";

const FEATURES = [
  { icon: "🃏", title: "78 lá bài tarot", desc: "Đầy đủ Major & Minor Arcana" },
  { icon: "🤖", title: "AI đọc bài", desc: "DeepSeek AI giải nghĩa tiếng Việt Gen Z" },
  { icon: "🎯", title: "4 chủ đề", desc: "Tình yêu, sự nghiệp, tài chính, bản thân" },
  { icon: "💬", title: "Chat với bestie", desc: "Hỏi AI về lá bài bất kỳ lúc nào" },
];

const THEMES = [
  { id: "love", emoji: "💕", name: "Tình Yêu", desc: "Crush có thích mình không ta?" },
  { id: "career", emoji: "💼", name: "Sự Nghiệp", desc: "Career path của mình sẽ thế nào?" },
  { id: "finance", emoji: "💰", name: "Tài Chính", desc: "Vận tài lộc tháng này ra sao?" },
  { id: "self", emoji: "🌸", name: "Bản Thân", desc: "Mình cần focus vào điều gì?" },
];

export default function HomePage() {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-celestial overflow-hidden">
      <ParticleEffect />
      <Header />
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center pt-28">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-lavender/40 blur-2xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-rose/40 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-mint/30 blur-xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          {/* Badge */}
          <motion.span
            className="px-4 py-1.5 rounded-full glass border border-purple-mid/30 text-xs font-body font-bold text-purple-deep uppercase tracking-widest"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ AI Tarot dành riêng cho Gen Z ✨
          </motion.span>

          {/* Main title */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text-shimmer">Xem bói</span>
            <br />
            <span className="text-purple-deep">nào bestie</span>
            <br />
            <span className="text-4xl sm:text-5xl">🔮</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="font-body text-base sm:text-lg text-purple-deep/70 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            AI tarot đọc bài theo phong cách Gen Z — thẳng thắn, hài hước và sâu sắc.
            Khám phá những gì vũ trụ muốn nói với bạn hôm nay! 💫
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/reading">
              <motion.button
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-base shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                🃏 Rút bài ngay
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setHistoryOpen(true)}
              className="px-8 py-4 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-base shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📖 Lịch sử bói
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-xs font-body text-purple-deep/40">Scroll xuống</p>
          <span className="text-purple-deep/40">↓</span>
        </motion.div>
      </section>

      {/* Theme Selection Quick Access */}
      <section className="relative z-10 px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Chọn chủ đề của bạn
          </h2>
          <p className="font-body text-purple-deep/60 mt-2">
            Vũ trụ đang chờ để trả lời câu hỏi của bạn ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {THEMES.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/reading?theme=${theme.id}`}>
                <motion.div
                  className="glass rounded-2xl p-5 text-center cursor-pointer border border-white/50 hover:border-purple-mid/40 transition-colors"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-4xl block mb-2">{theme.emoji}</span>
                  <h3 className="font-display font-bold text-purple-deep text-sm">
                    {theme.name}
                  </h3>
                  <p className="font-body text-purple-deep/50 text-xs mt-1 leading-tight">
                    {theme.desc}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Vì sao chọn Tarot Bestie?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-2xl p-5 text-center border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="font-display font-bold text-purple-deep text-sm mb-1">
                {f.title}
              </h3>
              <p className="font-body text-purple-deep/60 text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-purple-deep mb-3">
            Sẵn sàng chưa? 🌙
          </h2>
          <p className="font-body text-purple-deep/60 mb-8 text-sm">
            Hãy để tarot soi sáng con đường của bạn hôm nay. Vũ trụ luôn muốn bạn
            phát triển bestie ơi!
          </p>
          <Link href="/reading">
            <motion.button
              className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-deep via-pink-soft to-peach text-white font-body font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 10px 40px rgba(123,79,166,0.3)",
                  "0 10px 60px rgba(232,115,154,0.4)",
                  "0 10px 40px rgba(123,79,166,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Bắt đầu xem bói
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs font-body text-purple-deep/30">
        Made with 💜 for Gen Z Vietnam • Tarot Bestie 2024
      </footer>
    </main>
  );
}
