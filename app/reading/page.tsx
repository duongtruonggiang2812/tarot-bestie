"use client";

import { Suspense, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ParticleEffect from "@/components/ParticleEffect";
import Header from "@/components/Header";
import ShuffleDeck from "@/components/ShuffleDeck";
import TarotCard from "@/components/TarotCard";
import CardModal from "@/components/CardModal";
import ChatBox from "@/components/ChatBox";
import PurchaseModal from "@/components/PurchaseModal";
import CoinBadge from "@/components/CoinBadge";
import { TarotCard as TarotCardType, getRandomCards } from "@/data/tarotCards";
import { useCoinStore, COIN_COSTS, FREE_READS_PER_DAY } from "@/store/coinStore";

type Phase = "setup" | "shuffle" | "drawing" | "revealing" | "reading" | "chat";

const THEMES = [
  { id: "general", emoji: "🔮", name: "Tổng Quát" },
  { id: "love", emoji: "💕", name: "Tình Yêu" },
  { id: "career", emoji: "💼", name: "Sự Nghiệp" },
  { id: "finance", emoji: "💰", name: "Tài Chính" },
  { id: "self", emoji: "🌸", name: "Bản Thân" },
];

const CARD_COUNTS = [1, 3, 5];

function ReadingCostLabel({ count }: { count: number }) {
  const { freeReadsToday } = useCoinStore();
  const isFree = freeReadsToday < FREE_READS_PER_DAY;
  const cost = count === 1 ? COIN_COSTS.read1 : count === 3 ? COIN_COSTS.read3 : COIN_COSTS.read5;

  if (isFree) {
    return (
      <span className="text-xs font-body text-mint font-semibold">
        Miễn phí hôm nay ({freeReadsToday}/{FREE_READS_PER_DAY}) 🎁
      </span>
    );
  }
  if (cost === 0) {
    return <span className="text-xs font-body text-purple-deep/60">Miễn phí 🆓</span>;
  }
  return (
    <span className="text-xs font-body text-purple-deep/70">
      Sẽ tốn {cost} xu 🪙
    </span>
  );
}

function ReadingPageInner() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { coins, freeReadsToday, spendCoins, setFreeReads } = useCoinStore();

  const initialTheme = searchParams.get("theme") ?? "general";

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedCount, setSelectedCount] = useState(3);
  const [cards, setCards] = useState<TarotCardType[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [zoomedCard, setZoomedCard] = useState<TarotCardType | null>(null);
  const [readingText, setReadingText] = useState("");
  const [aiStreaming, setAiStreaming] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  const isFreeRead = freeReadsToday < FREE_READS_PER_DAY;
  const cost = selectedCount === 1 ? COIN_COSTS.read1 : selectedCount === 3 ? COIN_COSTS.read3 : COIN_COSTS.read5;
  const canAfford = isFreeRead || cost === 0 || coins >= cost;

  const handleDraw = useCallback(() => {
    if (!canAfford) {
      setShowPurchase(true);
      return;
    }

    // Deduct cost or increment free read
    if (isFreeRead) {
      setFreeReads(freeReadsToday + 1);
      if (session?.user?.id) {
        fetch("/api/coins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "free_read" }),
        }).catch(() => {});
      }
    } else if (cost > 0) {
      spendCoins(cost);
      if (session?.user?.id) {
        fetch("/api/coins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "spend", amount: cost }),
        }).catch(() => {});
      }
    }

    const drawn = getRandomCards(selectedCount);
    setCards(drawn);
    setRevealedCards(new Set());
    setReadingText("");
    setPhase("drawing");
  }, [canAfford, isFreeRead, cost, selectedCount, session, spendCoins, freeReadsToday, setFreeReads]);

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
    // Check coins for AI reading
    if (coins < COIN_COSTS.aiRead) {
      setShowPurchase(true);
      return;
    }

    spendCoins(COIN_COSTS.aiRead);
    if (session?.user?.id) {
      fetch("/api/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "spend", amount: COIN_COSTS.aiRead }),
      }).catch(() => {});
    }

    setAiStreaming(true);
    setPhase("reading");
    setReadingText("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards, theme: selectedTheme }),
      });

      if (!response.body) throw new Error("No body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setReadingText(fullText);
              }
            } catch {
              // ignore
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

  return (
    <main className="relative min-h-screen bg-celestial overflow-hidden">
      <ParticleEffect />
      <Header />
      <PurchaseModal isOpen={showPurchase} onClose={() => setShowPurchase(false)} />
      <CardModal card={zoomedCard} onClose={() => setZoomedCard(null)} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 pt-20 pb-4 max-w-5xl mx-auto">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 text-purple-deep/70 font-body text-sm font-semibold"
            whileHover={{ x: -3 }}
          >
            ← Về trang chủ
          </motion.button>
        </Link>
        <div className="flex items-center gap-3">
          {phase !== "setup" && (
            <motion.button
              className="text-sm font-body text-purple-deep/60 font-semibold"
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
                  Xem bói nào! ✨
                </h1>
                <p className="font-body text-purple-deep/60 mt-2 text-sm">
                  Chọn chủ đề và số lá bài, rồi để vũ trụ nói chuyện với bạn 🌙
                </p>
              </div>

              {/* Theme */}
              <div className="w-full max-w-2xl">
                <h2 className="font-display font-bold text-purple-deep text-lg mb-4 text-center">
                  Chủ đề hôm nay?
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
                      <span className="text-xs font-bold text-purple-deep">{t.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card count */}
              <div className="w-full max-w-md">
                <h2 className="font-display font-bold text-purple-deep text-lg mb-4 text-center">
                  Rút bao nhiêu lá?
                </h2>
                <div className="flex justify-center gap-4">
                  {CARD_COUNTS.map((count) => (
                    <motion.button
                      key={count}
                      onClick={() => setSelectedCount(count)}
                      className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all font-body ${
                        selectedCount === count
                          ? "border-purple-mid bg-lavender/60 shadow-lg"
                          : "border-white/50 glass hover:border-purple-mid/40"
                      }`}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl font-display font-bold text-purple-deep">
                        {count}
                      </span>
                      <span className="text-[10px] text-purple-deep/60 font-semibold">
                        {count === 1 ? "lá" : "lá bài"}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-xs font-body text-purple-deep/40 mt-3">
                  {selectedCount === 1 && "Nhanh gọn, 1 lá bài chính 🎯"}
                  {selectedCount === 3 && "Quá khứ - Hiện tại - Tương lai 🌙"}
                  {selectedCount === 5 && "Trải bài đầy đủ, chi tiết nhất ✨"}
                </p>
                <div className="text-center mt-2">
                  <ReadingCostLabel count={selectedCount} />
                </div>
              </div>

              <motion.button
                onClick={() => setPhase("shuffle")}
                className="px-12 py-5 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-lg shadow-2xl"
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
                🎴 Tiếp tục
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
                <h2 className="font-display text-3xl font-bold text-purple-deep">
                  Xào bài nào! 🎴
                </h2>
                <p className="font-body text-purple-deep/60 text-sm mt-1">
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá
                </p>
                <div className="mt-2">
                  <ReadingCostLabel count={selectedCount} />
                </div>
              </div>

              <ShuffleDeck onDraw={handleDraw} />
            </motion.div>
          )}

          {/* PHASE 3 & 4: DRAWING + REVEALING */}
          {(phase === "drawing" || phase === "revealing") && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <motion.div className="text-center" layout>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-purple-deep">
                  {allRevealed ? "Tất cả lá bài đã lộ diện! 🌟" : "Chạm vào từng lá để lật bài ✨"}
                </h2>
                <p className="font-body text-purple-deep/60 text-sm mt-1">
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá bài
                </p>
              </motion.div>

              {/* Cards */}
              <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${cards.length === 5 ? "max-w-2xl" : ""}`}>
                {cards.map((card, i) => (
                  <TarotCard
                    key={card.id}
                    card={card}
                    index={i}
                    isRevealed={revealedCards.has(i)}
                    onClick={() => handleCardReveal(i)}
                    onZoom={(c) => setZoomedCard(c)}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-4">
                {!allRevealed && (
                  <motion.button
                    onClick={handleRevealAll}
                    className="px-8 py-3 rounded-full glass border border-purple-mid/40 text-purple-deep font-body font-bold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Lật hết tất cả ✨
                  </motion.button>
                )}

                {allRevealed && (
                  <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="font-body text-purple-deep/60 text-sm text-center">
                      Sẵn sàng nghe bestie AI đọc bài chưa?
                    </p>
                    <motion.button
                      onClick={handleGetReading}
                      className="flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      animate={{
                        boxShadow: [
                          "0 8px 30px rgba(123,79,166,0.3)",
                          "0 8px 50px rgba(123,79,166,0.5)",
                          "0 8px 30px rgba(123,79,166,0.3)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span>🔮</span>
                      <span>Đọc bài với AI ({COIN_COSTS.aiRead} xu)</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
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
                <h2 className="font-display text-2xl font-bold text-purple-deep">
                  {aiStreaming ? "Bestie đang đọc bài... 🔮" : "Kết quả xem bói 🌟"}
                </h2>
                <p className="font-body text-purple-deep/60 text-sm mt-1">
                  {themeInfo?.emoji} {themeInfo?.name} · {selectedCount} lá
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
                      src={`/cards/${card.arcana === "major" ? `ar${String(card.id).padStart(2, "0")}` : `${card.suit === "wands" ? "wa" : card.suit === "cups" ? "cu" : card.suit === "swords" ? "sw" : "pe"}${String(card.number).padStart(2, "0")}`}.jpg`}
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

              {/* AI Reading text */}
              <motion.div
                className="w-full glass rounded-3xl border border-white/60 shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔮</span>
                  <h3 className="font-display font-bold text-purple-deep text-lg">
                    Luận giải của Bestie AI
                  </h3>
                </div>

                {aiStreaming && !readingText && (
                  <div className="flex gap-2 items-center text-purple-deep/60">
                    <span className="text-sm font-body">Đang phân tích bài tarot</span>
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>●</span>
                    </span>
                  </div>
                )}

                {readingText && (
                  <div className="font-body text-purple-deep/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {readingText}
                    {aiStreaming && <span className="animate-pulse">▊</span>}
                  </div>
                )}
              </motion.div>

              {/* Chat box — shown after reading is done */}
              {!aiStreaming && readingText && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ChatBox cards={cards} theme={selectedTheme} initialReading={readingText} />
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
                    className="px-6 py-3 rounded-full glass border border-purple-mid/30 text-purple-deep font-body font-bold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ↺ Xem lại từ đầu
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setPhase("shuffle");
                      setCards([]);
                      setRevealedCards(new Set());
                      setReadingText("");
                    }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-deep to-pink-soft text-white font-body font-bold text-sm shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    🃏 Rút bài mới
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
