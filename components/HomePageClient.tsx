"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ParticleEffect from "@/components/ParticleEffect";
import Header from "@/components/Header";
import HistoryPanel from "@/components/HistoryPanel";

// ── Data ──────────────────────────────────────────────────────────────────────
const THEMES = [
  { id: "love",    emoji: "💕", name: "Tình Yêu",  desc: "Crush có để ý mình không?",     color: "from-rose-400 to-pink-500"        },
  { id: "career",  emoji: "💼", name: "Sự Nghiệp", desc: "Công việc này có hợp mình?",    color: "from-violet-500 to-purple-600"    },
  { id: "finance", emoji: "💰", name: "Tài Chính", desc: "Tháng này tiền vào hay ra?",     color: "from-amber-400 to-orange-500"     },
  { id: "self",    emoji: "🌸", name: "Bản Thân",  desc: "Mình đang cần thay đổi gì?",    color: "from-fuchsia-400 to-pink-500"     },
  { id: "general", emoji: "🔮", name: "Tổng Quát", desc: "Vũ trụ nhắn gì hôm nay?",       color: "from-indigo-500 to-violet-600"    },
];

const READERS = [
  {
    id: "mystic",
    name: "Bà Đồng Huyền Bí",
    emoji: "🌙",
    img: "/readers/ba-dong.jpg",
    vibe: "Tâm linh · Tiên tri",
    quote: "Vũ trụ đã an bài từ trước rồi...",
    gradient: "from-violet-900 to-purple-700",
    tag: "Huyền bí nhất",
  },
  {
    id: "frank",
    name: "Bestie Thẳng Thắn",
    emoji: "💬",
    img: "/readers/bestie.jpg",
    vibe: "Thực tế · Gen Z",
    quote: "Nói thẳng luôn nha, không có vòng vo!",
    gradient: "from-pink-500 to-rose-500",
    tag: "Được yêu thích nhất",
  },
  {
    id: "analyst",
    name: "Nhà Tâm Lý",
    emoji: "🧠",
    img: "/readers/nha-tam-ly.jpg",
    vibe: "Phân tích · Nội tâm",
    quote: "Hiểu mình rồi mới hiểu được vũ trụ.",
    gradient: "from-cyan-600 to-teal-600",
    tag: "Sâu sắc nhất",
  },
  {
    id: "angel",
    name: "Thiên Thần",
    emoji: "👼",
    img: "/readers/thien-than.jpg",
    vibe: "Chữa lành · Yêu thương",
    quote: "Bạn xứng đáng được yêu thương 💛",
    gradient: "from-amber-400 to-yellow-500",
    tag: "Chữa lành nhất",
  },
];

const STEPS = [
  { step: "01", emoji: "🎯", title: "Chọn chủ đề", desc: "Tình yêu? Sự nghiệp? Hay muốn vũ trụ tự chọn cho?" },
  { step: "02", emoji: "🃏", title: "Rút bài ngẫu nhiên", desc: "Xào bài — rút 1, 3 hoặc 5 lá. Vũ trụ sẽ dẫn đường." },
  { step: "03", emoji: "✨", title: "AI đọc bài cho nghe", desc: "Nhận diễn giải chi tiết bằng tiếng Việt, hỏi thêm bao nhiêu cũng được." },
];

const TESTIMONIALS = [
  { text: "Đọc bài chuẩn vl, mình hỏi về crush rồi tuần sau mấy cái nó y chang 😭", name: "Minh Châu, 22t", emoji: "💕" },
  { text: "Bestie Thẳng Thắn nói thẳng quá trời, nghe mà tỉnh người luôn. Recommend cực!", name: "Gia Bảo, 20t", emoji: "🔥" },
  { text: "Trước giờ chưa tin tarot nhưng thử xong thấy AI phân tích hay phết. Dùng mỗi sáng giờ 😂", name: "Thu Hà, 24t", emoji: "☕" },
  { text: "Giao diện dễ dùng, nhà tâm lý đọc bài hay lắm, đặt câu hỏi đúng chỗ đau 🥲", name: "Khánh Linh, 19t", emoji: "🌸" },
];

const STATS = [
  { num: "47.3K", label: "lần bói tháng này" },
  { num: "4.9★", label: "đánh giá trung bình" },
  { num: "12K+", label: "bạn đang dùng" },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

// ── Live counter (today readings) ─────────────────────────────────────────────
function LiveCounter() {
  const base = 1247;
  const [extra, setExtra] = useState(0);
  const displayed = useCounter(base + extra);

  useEffect(() => {
    const id = setInterval(() => {
      setExtra((n) => n + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-semibold"
      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 }}
    >
      <motion.span
        className="w-2 h-2 rounded-full bg-green-400"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-white/90">
        <strong className="text-white">{displayed.toLocaleString("vi-VN")}</strong> lần bói hôm nay
      </span>
    </motion.div>
  );
}

// ── Floating card ─────────────────────────────────────────────────────────────
function FloatingCard({ delay, x, rotate, scale }: { delay: number; x: number; rotate: number; scale: number }) {
  return (
    <motion.div
      className="absolute w-16 h-24 sm:w-20 sm:h-32 rounded-xl shadow-2xl border border-white/20"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.4))",
        backdropFilter: "blur(8px)",
        left: `${x}%`,
        top: "10%",
      }}
      initial={{ opacity: 0, y: 60, rotate: rotate - 10 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7],
        y: [60, 0, -8, 0],
        rotate: [rotate - 10, rotate, rotate + 2, rotate],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <div className="w-full h-full rounded-xl flex items-center justify-center text-2xl opacity-60">🔮</div>
      <div
        className="absolute inset-0 rounded-xl opacity-30"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)" }}
      />
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePageClient() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Auto-rotate testimonials
  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const faqItems = [
    { q: "Tarot Bestie có miễn phí không?", a: "Hoàn toàn miễn phí để rút bài và xem tổng quan! AI đọc bài chi tiết và chat hỏi thêm dùng xu — bạn nhận 3 xu miễn phí mỗi ngày chỉ bằng cách điểm danh 🎁" },
    { q: "Không biết gì về tarot có dùng được không?", a: "Dùng được ngay! Bạn không cần biết gì về tarot hết. Chỉ cần rút bài và đọc diễn giải của AI là đủ. Đơn giản như chat với bestie vậy thôi 😊" },
    { q: "4 reader khác nhau thế nào?", a: "Mỗi reader có cá tính riêng: Bà Đồng huyền bí tâm linh, Bestie thẳng thắn Gen Z, Nhà Tâm Lý phân tích sâu, Thiên Thần nhẹ nhàng chữa lành. Cùng một câu hỏi, 4 góc nhìn hoàn toàn khác nhau!" },
    { q: "Kết quả có chính xác không?", a: "Tarot không phải tiên tri — mà là gương phản chiếu. AI đọc bài dựa trên ý nghĩa 78 lá Rider-Waite kết hợp với câu hỏi của bạn, giúp nhìn vấn đề từ góc độ mới 🔮" },
  ];

  return (
    <main className="relative min-h-screen bg-celestial overflow-hidden">
      <ParticleEffect />
      <Header />
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-label="Hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center overflow-hidden"
      >
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #a855f7, transparent)", y: heroY }} />
          <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
          <div className="absolute bottom-20 -right-24 w-48 h-48 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        </div>

        {/* Floating cards (desktop only) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none">
          <FloatingCard delay={0}   x={8}  rotate={-15} scale={0.9} />
          <FloatingCard delay={0.4} x={82} rotate={12}  scale={1}   />
          <FloatingCard delay={0.8} x={72} rotate={-8}  scale={0.8} />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-mid/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.span animate={{ rotate: [0, 20, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>✨</motion.span>
            <span className="font-body font-bold text-purple-deep text-sm">AI Tarot tiếng Việt · Miễn phí · Dành cho Gen Z</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display font-bold leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl gradient-text-shimmer">
              Vũ trụ đang
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl text-purple-deep">
              nhắn gì
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl text-purple-deep/70 mt-1">
              cho bạn hôm nay? 🔮
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="font-body text-lg sm:text-xl text-purple-deep/65 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Câu trả lời đang ẩn trong 78 lá bài —
            <strong className="text-purple-deep"> giải mã miễn phí, riêng cho bạn</strong> 🌙
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/reading" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-8 py-4 rounded-full font-body font-bold text-lg text-white shadow-xl relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)" }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 10px 40px rgba(124,58,237,0.35)", "0 10px 60px rgba(236,72,153,0.45)", "0 10px 40px rgba(124,58,237,0.35)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="relative z-10">🃏 Rút bài ngay — miễn phí!</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setHistoryOpen(true)}
              className="px-8 py-4 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-lg hover:border-purple-mid/60 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              📖 Lịch sử bói
            </motion.button>
          </motion.div>

          {/* Live counter */}
          <LiveCounter />

          {/* Stats pills */}
          <motion.div
            className="flex items-center gap-4 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="font-display font-bold text-purple-deep text-xl">{s.num}</span>
                <span className="font-body text-purple-deep/45 text-xs">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-body text-xs text-purple-deep/35">Khám phá thêm</span>
          <span className="text-purple-deep/30 text-sm">↓</span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Cách hoạt động" className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-purple-deep/8 text-purple-deep/70 font-body text-xs font-bold uppercase tracking-widest mb-3">
            Đơn giản lắm
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            3 bước là xong 🚀
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-purple-mid/20 via-pink-soft/40 to-purple-mid/20" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div
                className="w-20 h-20 rounded-3xl flex flex-col items-center justify-center mb-4 shadow-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                whileHover={{ scale: 1.08, rotate: 3 }}
              >
                <span className="text-3xl">{s.emoji}</span>
              </motion.div>
              <div className="absolute -top-2 -right-2 sm:static sm:hidden w-6 h-6 rounded-full bg-purple-deep flex items-center justify-center text-white text-[10px] font-bold">{s.step}</div>
              <h3 className="font-display font-bold text-purple-deep text-lg mb-2">{s.title}</h3>
              <p className="font-body text-purple-deep/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/reading">
            <motion.button
              className="px-8 py-3.5 rounded-full font-body font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Thử ngay — miễn phí hoàn toàn ✨
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          READERS
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Reader" className="relative z-10 px-4 py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-purple-deep/8 text-purple-deep/70 font-body text-xs font-bold uppercase tracking-widest mb-3">
            4 Phong cách đọc bài
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Chọn bestie phù hợp nhất 💜
          </h2>
          <p className="font-body text-purple-deep/55 mt-3 text-base">
            Cùng 1 câu hỏi — 4 góc nhìn hoàn toàn khác nhau
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {READERS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link href={`/reading?reader=${r.id}`}>
                <div className="glass rounded-2xl overflow-hidden border border-white/50 hover:border-purple-mid/40 hover:shadow-xl transition-all cursor-pointer group">
                  {/* Avatar */}
                  <div className={`relative w-full aspect-square bg-gradient-to-br ${r.gradient} overflow-hidden`}>
                    <Image
                      src={r.img}
                      alt={r.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    {/* Tag badge */}
                    <div className="absolute top-2 left-2 right-2">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-body font-bold backdrop-blur-sm">
                        {r.tag}
                      </span>
                    </div>
                    {/* Emoji overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="font-body text-white text-xs italic leading-snug">"{r.quote}"</p>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="font-display font-bold text-purple-deep text-sm leading-tight">{r.name}</p>
                    <p className="font-body text-purple-deep/50 text-xs mt-0.5">{r.vibe}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center font-body text-purple-deep/40 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          👆 Hover vào ảnh để xem quote đặc trưng · Bấm để đọc bài ngay với reader đó
        </motion.p>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THEME PICKER
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Chủ đề bói" className="relative z-10 px-4 py-20 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Hôm nay hỏi về gì? 🌙
          </h2>
          <p className="font-body text-base text-purple-deep/55 mt-3">
            Chọn xong là rút bài luôn — không cần setup nhiều
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {THEMES.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/reading?theme=${theme.id}`}>
                <motion.div
                  className="rounded-2xl p-5 text-center cursor-pointer border border-white/50 relative overflow-hidden group"
                  style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)" }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Gradient fill on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <motion.span
                    className="text-4xl block mb-3"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {theme.emoji}
                  </motion.span>
                  <h3 className="font-display font-bold text-purple-deep text-sm sm:text-base">
                    {theme.name}
                  </h3>
                  <p className="font-body text-purple-deep/50 text-xs mt-1 leading-snug">
                    {theme.desc}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Người dùng nói gì" className="relative z-10 px-4 py-20">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
            Bestie nói về Tarot Bestie 💬
          </h2>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              className="glass rounded-3xl p-8 border border-white/50 text-center shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-4xl mb-4">{TESTIMONIALS[activeTestimonial].emoji}</div>
              <p className="font-body text-purple-deep/80 text-base leading-relaxed mb-5 italic">
                "{TESTIMONIALS[activeTestimonial].text}"
              </p>
              <p className="font-body font-bold text-purple-deep/60 text-sm">
                — {TESTIMONIALS[activeTestimonial].name}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === activeTestimonial ? "#7c3aed" : "rgba(124,58,237,0.25)",
                  transform: i === activeTestimonial ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Câu hỏi thường gặp" className="relative z-10 px-4 py-16 max-w-xl mx-auto">
        <motion.h2
          className="font-display text-3xl font-bold text-purple-deep text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Mà khoan, bạn muốn hỏi gì? 🤔
        </motion.h2>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl border border-white/50 overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-display font-bold text-purple-deep text-base">{item.q}</span>
                <motion.span
                  className="text-purple-deep/40 text-lg shrink-0 font-light"
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >+</motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 font-body text-purple-deep/65 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Bắt đầu" className="relative z-10 px-4 py-24 text-center">
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Big emoji */}
          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >🔮</motion.div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold text-purple-deep mb-4 leading-tight">
            Vũ trụ đang<br />
            <span className="gradient-text-shimmer">chờ bạn đó!</span>
          </h2>
          <p className="font-body text-purple-deep/60 text-base mb-8 leading-relaxed">
            Rút bài miễn phí ngay — không cần đăng ký, không cần biết gì về tarot.<br />
            <span className="text-purple-deep/80 font-semibold">Chỉ cần có câu hỏi là đủ.</span>
          </p>

          <Link href="/reading">
            <motion.button
              className="px-12 py-5 rounded-full font-body font-bold text-xl text-white shadow-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 15px 50px rgba(124,58,237,0.4)", "0 15px 70px rgba(236,72,153,0.5)", "0 15px 50px rgba(124,58,237,0.4)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ✨ Bắt đầu xem bói ngay
            </motion.button>
          </Link>

          <p className="font-body text-purple-deep/35 text-xs mt-5">
            Miễn phí · Không cần thẻ · Kết quả trong 30 giây
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-deep/8 py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-5 mb-4 font-body text-sm">
            <Link href="/reading" className="text-purple-deep/50 hover:text-purple-deep transition-colors">🔮 Xem bói</Link>
            <Link href="/blog"    className="text-purple-deep/50 hover:text-purple-deep transition-colors">📚 Blog</Link>
            <Link href="/coins"   className="text-purple-deep/50 hover:text-purple-deep transition-colors">🪙 Nạp xu</Link>
          </div>
          <p className="font-body text-purple-deep/30 text-xs">
            Made with 💜 for Gen Z Vietnam · Tarot Bestie 2025
          </p>
        </div>
      </footer>
    </main>
  );
}
