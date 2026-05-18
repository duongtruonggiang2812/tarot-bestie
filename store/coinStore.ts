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
  aiRead: 2,      // AI đọc bài chi tiết
  chatMessage: 1, // Mỗi tin nhắn chat hỏi thêm
} as const;

// Coin packages
export const COIN_PACKAGES = [
  { id: "starter", name: "Starter", coins: 50,  price: "9.000đ",  emoji: "🥉", popular: false },
  { id: "popular", name: "Popular", coins: 150, price: "19.000đ", emoji: "🥈", popular: true  },
  { id: "pro",     name: "Pro",     coins: 500, price: "49.000đ", emoji: "🥇", popular: false },
];
