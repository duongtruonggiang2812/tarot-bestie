"use client";

import React, { Suspense, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import ParticleEffect from "@/components/ParticleEffect";
import Header from "@/components/Header";
import ShuffleDeck from "@/components/ShuffleDeck";
import CardSpread from "@/components/CardSpread";
import BirthInfoModal, { getUserInfo, type UserInfo } from "@/components/BirthInfoModal";
import ReaderPicker from "@/components/ReaderPicker";
import TarotCard from "@/components/TarotCard";
import CardModal from "@/components/CardModal";
import ChatBox from "@/components/ChatBox";
import CoinBadge from "@/components/CoinBadge";
import { TarotCard as TarotCardType, getRandomCards } from "@/data/tarotCards";
import { getCardImageUrl } from "@/lib/cardImage";
import { useCoinStore, COIN_COSTS, getAiReadCost } from "@/store/coinStore";
import { getReader } from "@/data/tarotReaders";

type Phase = "setup" | "shuffle" | "drawing" | "revealing" | "reading" | "chat";

const THEMES = [
  { id: "general", emoji: "🔮", name: "Tổng Quát" },
  { id: "love", emoji: "💕", name: "Tình Yêu" },
  { id: "career", emoji: "💼", name: "Sự Nghiệp" },
  { id: "finance", emoji: "💰", name: "Tài Chính" },
  { id: "self", emoji: "🌸", name: "Bản Thân" },
];

const CARD_COUNTS = [1, 3, 5];

const SLOT_LABELS: Record<number, string[]> = {
  1: ["Thông Điệp"],
  3: ["Quá Khứ", "Hiện Tại", "Tương Lai"],
  5: ["Tình Huống", "Thách Thức", "Quá Khứ", "Tương Lai", "Kết Quả"],
};

// ── Inline markdown → styled JSX ──────────────────────────────────────────────
function parseInline(text: string, key: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    const boldIdx = remaining.indexOf("**");
    const italicIdx = remaining.search(/(?<!\*)\*(?!\*)/);

    if (boldIdx !== -1 && (italicIdx === -1 || boldIdx <= italicIdx)) {
      const end = remaining.indexOf("**", boldIdx + 2);
      if (end !== -1) {
        if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx));
        parts.push(<strong key={`${key}-b${idx++}`} className="font-bold text-purple-deep">{remaining.slice(boldIdx + 2, end)}</strong>);
        remaining = remaining.slice(end + 2);
        continue;
      }
    }
    if (italicIdx !== -1) {
      const end = remaining.indexOf("*", italicIdx + 1);
      if (end !== -1) {
        if (italicIdx > 0) parts.push(remaining.slice(0, italicIdx));
        parts.push(<em key={`${key}-i${idx++}`} className="italic text-purple-deep/75">{remaining.slice(italicIdx + 1, end)}</em>);
        remaining = remaining.slice(end + 1);
        continue;
      }
    }
    parts.push(remaining);
    break;
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function TarotMarkdown({ text, streaming }: { text: string; streaming: boolean }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const isLast = i === lines.length - 1;
    const cursor = streaming && isLast ? <span key="cur" className="animate-pulse text-purple-mid font-bold">▊</span> : null;

    if (line.trim() === "---") {
      nodes.push(<div key={i} className="my-5 border-t border-purple-mid/20" />);
      return;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <div key={i} className="flex items-center gap-2 mt-6 mb-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-deep to-purple-mid shrink-0" />
          <h3 className="font-display font-bold text-purple-deep text-lg leading-snug">
            {parseInline(line.slice(4), `h${i}`)}
          </h3>
        </div>
      );
      return;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="font-display font-bold text-purple-deep text-xl mt-6 mb-2">
          {parseInline(line.slice(3), `h2${i}`)}
        </h2>
      );
      return;
    }
    if (line.startsWith("- ")) {
      nodes.push(
        <div key={i} className="flex items-start gap-2.5 my-1.5 ml-1">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-mid shrink-0" />
          <span className="font-body text-purple-deep/85 text-base leading-relaxed">
            {parseInline(line.slice(2), `li${i}`)}{cursor}
          </span>
        </div>
      );
      return;
    }
    if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />);
      return;
    }
    nodes.push(
      <p key={i} className="font-body text-purple-deep/90 text-base leading-relaxed">
        {parseInline(line, `p${i}`)}{cursor}
      </p>
    );
  });

  return <div className="flex flex-col gap-0.5">{nodes}</div>;
}

function FreeLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-body font-semibold text-emerald-600">
      ✓ Rút bài & lật bài miễn phí
    </span>
  );
}

function ReadingPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { coins, spendCoins } = useCoinStore();

  // All hooks MUST be declared before any early returns (Rules of Hooks)
  const initialTheme = searchParams.get("theme") ?? "general";

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedCount, setSelectedCount] = useState(3);
  const [cards, setCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [zoomedCard, setZoomedCard] = useState<TarotCardType | null>(null);
  const [readingText, setReadingText] = useState("");
  const [aiStreaming, setAiStreaming] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedReaderId, setSelectedReaderId] = useState("mystic");

  // After OAuth redirect: restore saved cards so user doesn't need to re-shuffle
  useEffect(() => {
    if (status === "authenticated") {
      try {
        const saved = sessionStorage.getItem("tarot-pending");
        if (saved) {
          const { cards: savedCards, revealedIndices, theme, count } = JSON.parse(saved);
          setCards(savedCards);
          setRevealedCards(new Set<number>(revealedIndices));
          setSelectedTheme(theme);
          setSelectedCount(count);
          setPhase("revealing"); // all cards already face-up, ready for AI
          sessionStorage.removeItem("tarot-pending");
        }
      } catch {}
    }
  }, [status]);

  // Rút bài luôn miễn phí — không tốn xu, không giới hạn
  const handleDraw = useCallback(() => {
    const drawn = getRandomCards(selectedCount);
    setCards(drawn);
    setRevealedCards(new Set());
    setReadingText("");
    setPhase("drawing");
  }, [selectedCount]);

  // User picks a card from the spread → reveals next slot
  const handleCardPick = useCallback(() => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      next.add(prev.size); // reveal next index
      return next;
    });
  }, []);

  const handleCardReveal = useCallback((index: number) => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleRevealAll = useCallback(() => {
    const allIndices = new Set(cards.map((_, i) => i));
    setRevealedCards(allIndices);
    setPhase("revealing");
  }, [cards]);

  const handleGetReading = async () => {
    // Require login for AI reading — save current cards so they survive the OAuth redirect
    if (!session) {
      sessionStorage.setItem(
        "tarot-pending",
        JSON.stringify({
          cards,
          revealedIndices: Array.from(revealedCards),
          theme: selectedTheme,
          count: selectedCount,
        })
      );
      setShowLoginPrompt(true);
      return;
    }
    // Check coins for AI reading (giá theo số lá)
    const aiCost = getAiReadCost(selectedCount);
    if (coins < aiCost) {
      router.push("/coins");
      return;
    }

    spendCoins(aiCost);
    if (session?.user?.id) {
      fetch("/api/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spend", amount: aiCost }),
      }).catch(() => {});
    }

    setAiStreaming(true);
    setPhase("reading");
    setReadingText("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards,
          theme: selectedTheme,
          question: userQuestion,
          readerId: selectedReaderId,
          userInfo: userInfo?.name || userInfo?.birthdate || userInfo?.gender ? {
            name: userInfo.name,
            birthdate: userInfo.birthdate,
            gender: userInfo.gender,
          } : null,
        }),
      });

      if (!response.body) throw new Error("No body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") { streamDone = true; break; }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setReadingText(fullText);
              }
            } catch {
              // ignore partial chunks
            }
          }
        }
      }

      // Save reading if logged in
      if (session?.user?.id && fullText) {
        fetch("/api/readings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: selectedTheme,
            cards,
            ai_summary: fullText,
          }),
        }).catch(() => {});
      }
    } catch {
      setReadingText("Xin lỗi bestie, có lỗi xảy ra rồi. Thử lại nhé! 😢");
    } finally {
      setAiStreaming(false);
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setCards([]);
    setRevealedCards(new Set());
    setReadingText("");
  };

  const allRevealed = cards.length > 0 && revealedCards.size === cards.length;
  const themeInfo = THEMES.find((t) => t.id === selectedTheme);
  const isDark = phase === "shuffle" || phase === "drawing";
  const activeReader = getReader(selectedReaderId);

  return (
    <main className={isDark ? "relative min-h-screen overflow-hidden" : "relative min-h-screen bg-celestial overflow-hidden"}
      style={isDark ? { background: "#07090f" } : {}}
    >
      <BirthInfoModal
        isOpen={showBirthModal}
        onDone={(info) => {
          setUserInfo(info);
          setShowBirthModal(false);
          setPhase("shuffle");
        }}
      />

      {!isDark && <ParticleEffect />}

      {/* Dark starfield */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{
                width: i % 5 === 0 ? 2 : 1,
                height: i % 5 === 0 ? 2 : 1,
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                opacity: 0.1 + (i % 4) * 0.15,
              }}
              animate={{ opacity: [0.1 + (i % 4) * 0.1, 0.6, 0.1 + (i % 4) * 0.1] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
      )}

      <Header />
      <CardModal card={zoomedCard} onClose={() => setZoomedCard(null)} />

      {/* Login prompt modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowLoginPrompt(false)}
            />
            {/* Card */}
            <motion.div
              className="relative rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-5 shadow-2xl"
              style={{ background: "linear-gradient(160deg, #fff 0%, #f3e8ff 100%)" }}
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              {/* Close */}
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-purple-deep/30 hover:text-purple-deep/70 hover:bg-purple-deep/10 transition-colors text-lg"
              >
                ✕
              </button>

              <div className="text-5xl mt-1">🔮</div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-bold text-purple-deep">
                  Đăng nhập để AI đọc bài
                </h3>
                <p className="font-body text-purple-deep/60 text-sm leading-relaxed">
                  Bài của bestie vẫn được giữ nguyên — đăng nhập xong là AI đọc luôn, không cần làm lại từ đầu nhé! ✨
                </p>
              </div>

              <button
                onClick={() => signIn("google")}
                className="w-full py-3.5 px-6 rounded-2xl font-body font-bold text-white text-sm flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng nhập bằng Google
              </button>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-xs font-body text-purple-deep/35 hover:text-purple-deep/60 transition-colors"
              >
                Để sau
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 pt-20 pb-4 max-w-5xl mx-auto">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 font-body text-base font-semibold"
            style={{ color: isDark ? "rgba(232,213,163,0.6)" : undefined }}
            whileHover={{ x: -3 }}
          >
            ← Trang chủ
          </motion.button>
        </Link>
        <div className="flex items-center gap-3">
          {phase !== "setup" && (
            <motion.button
              className="text-base font-body font-semibold"
              style={{ color: isDark ? "rgba(232,213,163,0.5)" : undefined }}
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
            >
              Làm lại ↺
            </motion.button>
          )}
          <CoinBadge />
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">

          {/* PHASE 1: SETUP */}
          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-10"
            >
              <div className="text-center">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-purple-deep">
                  Vũ trụ nhắn gì hôm nay? 🔮
                </h1>
                <p className="font-body text-purple-deep/60 mt-3 text-base">
                  Chọn chủ đề và số lá — bestie AI đọc cho nghe liền 🌙
                </p>
              </div>

              {/* Theme */}
              <div className="w-full max-w-2xl">
                <h2 className="font-display font-bold text-purple-deep text-xl mb-5 text-center">
                  Đang muốn hỏi về gì? 🤔
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {THEMES.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all font-body ${
                        selectedTheme === t.id
                          ? "border-purple-mid bg-lavender/60 shadow-lg"
                          : "border-white/50 glass hover:border-purple-mid/40"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-sm font-bold text-purple-deep">{t.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card count */}
              <div className="w-full max-w-md">
                <h2 className="font-display font-bold text-purple-deep text-xl mb-5 text-center">
                  Muốn đọc sâu cỡ nào? 🃏
                </h2>
                <div className="flex justify-center gap-4">
                  {CARD_COUNTS.map((count) => (
                    <motion.button
                      key={count}
                      onClick={() => setSelectedCount(count)}
                      className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all font-body ${
                        selectedCount === count
                          ? "border-purple-mid bg-lavender/60 shadow-lg"
                          : "border-white/50 glass hover:border-purple-mid/40"
                      }`}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl font-display font-bold text-purple-deep">
                        {count}
                      </span>
                      <span className="text-xs text-purple-deep/60 font-semibold">
                        {count === 1 ? "lá bài" : "lá bài"}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm font-body text-purple-deep/50 mt-4">
                  {selectedCount === 1 && "1 lá — nhanh, gọn, thẳng vào vấn đề 🎯"}
                  {selectedCount === 3 && "3 lá — Quá khứ · Hiện tại · Tương lai 🌙"}
                  {selectedCount === 5 && "5 lá — đọc chi tiết nhất, không bỏ sót gì ✨"}
                </p>
                <div className="text-center mt-2 flex flex-col items-center gap-1">
                  <FreeLabel />
                  <span className="text-xs font-body text-purple-deep/40">
                    AI đọc bài tốn <strong className="text-purple-deep/60">{getAiReadCost(selectedCount)} xu</strong> · Chat hỏi thêm tốn <strong className="text-purple-deep/60">1 xu/tin</strong>
                  </span>
                </div>
              </div>

              {/* Reader picker */}
              <ReaderPicker selectedId={selectedReaderId} onChange={setSelectedReaderId} />

              {/* Question input */}
              <div className="w-full max-w-xl">
                <h2 className="font-display font-bold text-purple-deep text-xl mb-3 text-center">
                  Muốn hỏi cụ thể không? <span className="text-purple-deep/40 text-base font-normal">(không bắt buộc)</span>
                </h2>
                <div className="relative">
                  <textarea
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="VD: Crush có thích mình không? Tháng này có nên nhảy việc không?..."
                    maxLength={200}
                    rows={3}
                    className="w-full rounded-2xl px-5 py-4 font-body text-base text-purple-deep placeholder-purple-deep/30 outline-none resize-none border-2 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      borderColor: userQuestion ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                  <div className="absolute bottom-3 right-4 font-body text-xs text-purple-deep/30">
                    {userQuestion.length}/200
                  </div>
                </div>
                {userQuestion && (
                  <motion.p className="text-center text-sm font-body text-purple-mid mt-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ✨ AI sẽ đọc bài tập trung vào câu hỏi của bạn!
                  </motion.p>
                )}
              </div>

              <motion.button
                onClick={() => {
                  const saved = getUserInfo();
                  if (!saved) {
                    setShowBirthModal(true);
                  } else {
                    setUserInfo(saved);
                    setPhase("shuffle");
                  }
                }}
                className="px-14 py-5 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-xl shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    "0 10px 40px rgba(123,79,166,0.3)",
                    "0 10px 60px rgba(232,115,154,0.5)",
                    "0 10px 40px rgba(123,79,166,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎴 Xào bài — bắt đầu thôi!
              </motion.button>
            </motion.div>
          )}

          {/* PHASE 2: SHUFFLE */}
          {phase === "shuffle" && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold"
                  style={{ color: "#e8d5a3", textShadow: "0 0 30px rgba(212,168,71,0.4)" }}>
                  Thở đều · Tập trung · Rút bài 🌙
                </h2>
                <p className="font-body text-base mt-2" style={{ color: "rgba(232,213,163,0.6)" }}>
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá · {activeReader.emoji} {activeReader.name}
                </p>
              </div>

              <ShuffleDeck onDone={handleDraw} />
            </motion.div>
          )}

          {/* PHASE 3: DRAWING — dark card picker */}
          {phase === "drawing" && (
            <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6 w-full">

              {/* Title */}
              <div className="text-center px-4">
                <h2 className="font-display text-2xl sm:text-3xl font-bold"
                  style={{ color: "#e8d5a3", textShadow: "0 0 20px rgba(212,168,71,0.3)" }}>
                  Chọn {selectedCount} lá bài
                </h2>
                {userQuestion ? (
                  <div className="mt-2 mx-auto max-w-sm px-4 py-2 rounded-xl"
                    style={{ background: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.25)" }}>
                    <p className="font-body text-sm italic" style={{ color: "rgba(232,213,163,0.8)" }}>
                      ✦ &ldquo;{userQuestion}&rdquo;
                    </p>
                  </div>
                ) : (
                  <p className="font-body text-sm mt-1" style={{ color: "rgba(232,213,163,0.5)" }}>
                    Tin vào trực giác — chọn {selectedCount} lá bạn cảm thấy kéo về phía mình ✨
                  </p>
                )}
              </div>

              {/* SLOTS */}
              <div className="flex justify-center gap-4 sm:gap-6 flex-wrap px-4">
                {(SLOT_LABELS[selectedCount] ?? Array.from({ length: selectedCount }, (_, i) => `Lá ${i + 1}`)).map((label, i) => {
                  const isRevealed = revealedCards.has(i);
                  const card = cards[i];
                  return (
                    <motion.div key={i} className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}>
                      <p className="font-body font-bold text-xs tracking-widest uppercase"
                        style={{ color: isRevealed ? "rgba(212,168,71,0.9)" : "rgba(180,140,60,0.5)" }}>
                        {label}
                      </p>
                      <div className="relative w-28 h-44 rounded-xl overflow-hidden"
                        style={{
                          border: isRevealed
                            ? "1.5px solid rgba(212,168,71,0.7)"
                            : "1.5px dashed rgba(180,140,60,0.35)",
                          background: isRevealed ? "transparent" : "rgba(255,255,255,0.02)",
                        }}>
                        {isRevealed && card ? (
                          <motion.div className="w-full h-full"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getCardImageUrl(card)} alt={card.nameVi}
                              className="w-full h-full object-cover"
                              style={{ transform: card.isReversed ? "rotate(180deg)" : "none" }} />
                            <div className="absolute bottom-0 inset-x-0 py-1.5 px-1 text-center"
                              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
                              <p className="text-white font-body font-bold text-[10px]">{card.nameVi}</p>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-body text-2xl" style={{ color: "rgba(180,140,60,0.25)" }}>?</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress */}
              <p className="font-body text-sm" style={{ color: "rgba(212,168,71,0.6)" }}>
                {revealedCards.size} / {selectedCount} lá đã chọn
              </p>

              {/* Card spread */}
              {!allRevealed && (
                <motion.div className="w-full" initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <CardSpread
                    totalSlots={selectedCount}
                    pickedCount={revealedCards.size}
                    onPick={handleCardPick}
                  />
                </motion.div>
              )}

              {/* Done — show reading button */}
              {allRevealed && (
                <motion.div className="flex flex-col items-center gap-4 mt-2"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="font-body text-base text-center" style={{ color: "rgba(232,213,163,0.7)" }}>
                    Tất cả lá đã chọn ✦ Để AI đọc bài cho bạn nhé?
                  </p>
                  <motion.button onClick={handleGetReading}
                    className="flex items-center gap-3 px-12 py-4 rounded-full font-body font-bold text-base"
                    style={{ background: "linear-gradient(135deg, #d4a847, #f0c060, #b8860b)", color: "#1a0e00" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ boxShadow: ["0 0 20px rgba(212,168,71,0.3)", "0 0 40px rgba(212,168,71,0.6)", "0 0 20px rgba(212,168,71,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    ✦ AI đọc bài cho mình · {getAiReadCost(selectedCount)} xu
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PHASE 4: REVEALING (after OAuth redirect) */}
          {phase === "revealing" && (
            <motion.div key="revealing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8">
              <div className="text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
                  Bài của bạn 🌟
                </h2>
                <p className="font-body text-purple-deep/60 text-base mt-2">
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá bài
                </p>
              </div>
              <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${cards.length === 5 ? "max-w-2xl" : ""}`}>
                {cards.map((card, i) => (
                  <TarotCard key={card.id} card={card} index={i} isRevealed={true}
                    onZoom={(c) => setZoomedCard(c)} />
                ))}
              </div>
              <motion.button onClick={handleGetReading}
                className="flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 8px 30px rgba(123,79,166,0.3)", "0 8px 50px rgba(123,79,166,0.5)", "0 8px 30px rgba(123,79,166,0.3)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                <span>🔮</span>
                <span>AI đọc bài cho mình</span>
                <span className="text-sm font-normal opacity-80">· {getAiReadCost(selectedCount)} xu</span>
              </motion.button>
            </motion.div>
          )}

          {/* PHASE 5 & 6: READING + CHAT */}
          {(phase === "reading" || phase === "chat") && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Cards small view */}
              <motion.div className="text-center" layout>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep">
                  {aiStreaming ? "AI đang đọc bài... 🔮" : "Kết quả của bestie 🌟"}
                </h2>
                <p className="font-body text-purple-deep/60 text-base mt-2">
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá bài
                </p>
              </motion.div>

              {/* Mini card row */}
              <div className="flex flex-wrap justify-center gap-3">
                {cards.map((card, i) => (
                  <motion.button
                    key={card.id}
                    onClick={() => setZoomedCard(card)}
                    className="relative w-16 h-24 rounded-xl overflow-hidden border-2 border-purple-mid/40 shadow-md hover:scale-105 transition-transform"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getCardImageUrl(card)}
                      alt={card.nameVi}
                      className="w-full h-full object-cover"
                      style={card.isReversed ? { transform: "rotate(180deg)" } : {}}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5">
                      <p className="text-[8px] text-white text-center font-body leading-tight px-0.5">
                        {card.nameVi}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* AI Reading — beautiful card */}
              <motion.div
                className="w-full rounded-3xl shadow-xl overflow-hidden"
                style={{ background: "linear-gradient(160deg, #fff 0%, #f5f0ff 100%)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-3 px-6 py-4 border-b border-purple-mid/10"
                  style={{ background: "linear-gradient(90deg,#7c3aed08,#a855f708)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `linear-gradient(135deg, ${activeReader.color}, ${activeReader.color}99)` }}
                  >
                    {activeReader.emoji}
                  </div>
                  <div>
                    <p className="font-display font-bold text-purple-deep text-lg leading-none">{activeReader.name}</p>
                    <p className="font-body text-purple-deep/45 text-xs mt-0.5">
                      {themeInfo?.emoji} {themeInfo?.name} · {cards.length} lá bài
                    </p>
                  </div>
                  {aiStreaming && (
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-mid animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-purple-mid animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-2 h-2 rounded-full bg-purple-mid animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  {aiStreaming && !readingText && (
                    <div className="flex flex-col items-center gap-3 py-8 text-purple-deep/50">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-3xl"
                      >
                        🔮
                      </motion.div>
                      <p className="font-body text-sm font-semibold text-purple-deep/60">Bestie AI đang đọc bài... 🔮</p>
                      <p className="font-body text-xs text-purple-deep/35">Thường mất 10–20 giây, chờ tí nhé!</p>
                    </div>
                  )}

                  {readingText && (
                    <TarotMarkdown text={readingText} streaming={aiStreaming} />
                  )}
                </div>
              </motion.div>

              {/* Chat box — shown after reading is done */}
              {!aiStreaming && readingText && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ChatBox cards={cards} theme={selectedTheme} initialReading={readingText} question={userQuestion} userInfo={userInfo} readerId={selectedReaderId} />
                </motion.div>
              )}

              {/* Draw again */}
              {!aiStreaming && (
                <motion.div
                  className="flex gap-3 flex-wrap justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    onClick={handleReset}
                    className="px-8 py-3.5 rounded-full glass border border-purple-mid/30 text-purple-deep font-body font-bold text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ↺ Đổi chủ đề
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setPhase("shuffle");
                      setCards([]);
                      setRevealedCards(new Set());
                      setReadingText("");
                    }}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-base shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    🃏 Hỏi câu khác
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-celestial flex items-center justify-center">
          <motion.div
            className="text-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🔮
          </motion.div>
        </div>
      }
    >
      <ReadingPageInner />
    </Suspense>
  );
}
