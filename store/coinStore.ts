import { create } from "zustand";

interface CoinState {
  coins: number;
  setCoins: (coins: number) => void;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
}

export const useCoinStore = create<CoinState>((set, get) => ({
  coins: 0,
  setCoins: (coins) => set({ coins }),
  spendCoins: (amount) => {
    const { coins } = get();
    if (coins < amount) return false;
    set({ coins: coins - amount });
    return true;
  },
  addCoins: (amount) => set({ coins: get().coins + amount }),
}));

// Costs — rút bài & lật bài LUÔN MIỄN PHÍ
// Chỉ tốn xu khi nhận phân tích AI hoặc chat hỏi thêm
export const COIN_COSTS = {
  chatMessage: 1, // Mỗi tin nhắn chat hỏi thêm
} as const;

// Chi phí AI đọc bài theo số lá
export function getAiReadCost(cardCount: number): number {
  if (cardCount === 1) return 2;  // 1 lá → 2 xu
  if (cardCount === 3) return 4;  // 3 lá → 4 xu
  return 6;                        // 5 lá → 6 xu
}

// Coin packages
export const COIN_PACKAGES = [
  { id: "starter", name: "✨ Thử",      coins: 30,  price: "30.000đ",  popular: false },
  { id: "popular", name: "🔮 Phổ biến", coins: 100, price: "80.000đ",  popular: true  },
  { id: "bestie",  name: "💜 Bestie",   coins: 200, price: "140.000đ", popular: false },
  { id: "vip",     name: "👑 VIP",      coins: 600, price: "300.000đ", popular: false },
];
