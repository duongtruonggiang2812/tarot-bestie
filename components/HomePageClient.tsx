"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleEffect from "@/components/ParticleEffect";
import Header from "@/components/Header";
import HistoryPanel from "@/components/HistoryPanel";

const FEATURES = [
  { icon: "🃏", title: "78 lá Rider-Waite", desc: "Bộ bài chuẩn quốc tế, đầy đủ Major & Minor Arcana" },
  { icon: "🤖", title: "AI đọc bài tiếng Việt", desc: "Giải thích rõ ràng, đúng ngữ cảnh, không nói chung chung" },
  { icon: "💬", title: "Hỏi lại được luôn", desc: "Chat với AI về bất cứ lá bài nào sau khi xem xong" },
  { icon: "📚", title: "Lưu lịch sử", desc: "Xem lại 10 lần bói gần nhất bất cứ lúc nào" },
];

const THEMES = [
  { id: "love",    emoji: "💕", name: "Tình Yêu",  desc: "Crush có để ý mình không?" },
  { id: "career",  emoji: "💼", name: "Sự Nghiệp", desc: "Job này có hợp mình không ta?" },
  { id: "finance", emoji: "💰", name: "Tài Chính", desc: "Tháng này tiền bạc thế nào?" },
  { id: "self",    emoji: "🌸", name: "Bản Thân",  desc: "Mình cần thay đổi điều gì?" },
  { id: "general", emoji: "🔮", name: "Tổng Quát", desc: "Vũ trụ muốn nhắn gì hôm nay?" },
];

const FAQ = [
  {
    q: "Tarot Bestie có miễn phí không?",
    a: "Có! Rút bài và xem tổng quan hoàn toàn miễn phí. AI đọc chi tiết dùng xu — điểm danh mỗi ngày nhận 3 xu miễn phí.",
  },
  {
    q: "Có những reader nào?",
    a: "4 reader: Bà Đồng Huyền Bí, Bestie Thẳng Thắn, Nhà Tâm Lý và Thiên Thần — mỗi người một phong cách đọc bài khác nhau.",
  },
  {
    q: "Tarot AI có chính xác không?",
    a: "AI diễn giải dựa trên ý nghĩa truyền thống của 78 lá Rider-Waite kết hợp ngữ cảnh câu hỏi của bạn. Kết quả mang tính tham khảo, giúp nhìn vấn đề từ góc độ mới.",
  },
];

export default function HomePageClient() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-celestial overflow-hidden">
      <ParticleEffect />
      <Header />
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        aria-label="Giới thiệu"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center pt-28"
      >
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-lavender/40 blur-2xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-rose/40 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-mint/30 blur-xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          <motion.span
            className="px-4 py-2 rounded-full glass border border-purple-mid/30 text-sm font-body font-bold text-purple-deep uppercase tracking-widest"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ AI Tarot dành riêng cho Gen Z ✨
          </motion.span>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text-shimmer">Xem bói</span>
            <br />
            <span className="text-purple-deep">cùng bestie AI</span>
            <br />
            <span className="text-4xl sm:text-5xl">🔮</span>
          </motion.h1>

          <motion.p
            className="font-body text-lg sm:text-xl text-purple-deep/70 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Rút bài tarot miễn phí — AI đọc cho nghe bằng tiếng Việt,
            thẳng thắn, không nói vòng vo 💫
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/reading">
              <motion.button
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                🃏 Rút bài ngay — miễn phí!
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setHistoryOpen(true)}
              className="px-8 py-4 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📖 Xem lịch sử
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm font-body text-purple-deep/40">Cuộn xuống</p>
          <span className="text-purple-deep/40">↓</span>
        </motion.div>
      </section>

      {/* ── Theme Selection ──────────────────────────────────────── */}
      <section aria-label="Chủ đề bói" className="relative z-10 px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Hôm nay hỏi về gì? 🌙
          </h2>
          <p className="font-body text-base text-purple-deep/60 mt-3">
            Chọn chủ đề rồi để vũ trụ trả lời
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <span className="text-4xl block mb-3">{theme.emoji}</span>
                  <h3 className="font-display font-bold text-purple-deep text-base">
                    {theme.name}
                  </h3>
                  <p className="font-body text-purple-deep/55 text-sm mt-1 leading-snug">
                    {theme.desc}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section aria-label="Tính năng" className="relative z-10 px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Sao nên dùng Tarot Bestie? ✨
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-2xl p-6 text-center border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="font-display font-bold text-purple-deep text-base mb-2">
                {f.title}
              </h3>
              <p className="font-body text-purple-deep/60 text-sm leading-snug">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section aria-label="Câu hỏi thường gặp" className="relative z-10 px-4 py-16 max-w-2xl mx-auto">
        <motion.h2
          className="font-display text-3xl font-bold text-purple-deep text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Câu hỏi thường gặp 💬
        </motion.h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl border border-white/50 overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="font-display font-bold text-purple-deep text-base">{item.q}</span>
                <span className="text-purple-deep/50 ml-3 shrink-0 text-lg transition-transform"
                  style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-4"
                >
                  <p className="font-body text-purple-deep/70 text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section aria-label="Bắt đầu" className="relative z-10 px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep mb-3">
            Vũ trụ đang chờ bestie 🌙
          </h2>
          <p className="font-body text-base text-purple-deep/60 mb-8 leading-relaxed">
            Rút bài miễn phí, không cần đăng ký.<br />
            Đăng nhập khi muốn AI đọc chi tiết hơn thôi!
          </p>
          <Link href="/reading">
            <motion.button
              className="px-10 py-5 rounded-full bg-gradient-to-r from-purple-deep via-pink-soft to-peach text-white font-body font-bold text-xl shadow-2xl"
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

      <footer className="relative z-10 text-center py-8 text-sm font-body text-purple-deep/30">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Link href="/reading" className="hover:text-purple-deep/60 transition-colors">🔮 Xem bói</Link>
          <span>·</span>
          <Link href="/blog" className="hover:text-purple-deep/60 transition-colors">📚 Blog</Link>
          <span>·</span>
          <Link href="/coins" className="hover:text-purple-deep/60 transition-colors">🪙 Nạp xu</Link>
        </div>
        <p>Made with 💜 for Gen Z Vietnam • Tarot Bestie 2025</p>
      </footer>
    </main>
  );
}
