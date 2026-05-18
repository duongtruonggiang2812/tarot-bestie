import { create } from "zustand";

interface CoinState {
  coins: number;
  freeReadsToday: number;
  setCoins: (coins: number) => void;
  setFreeReads: (n: number) => void;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
}

export const useCoinStore = create<CoinState>((set, get) => ({
  coins: 0,
  freeReadsToday: 0,
  setCoins: (coins) => set({ coins }),
  setFreeReads: (n) => set({ freeReadsToday: n }),
  spendCoins: (amount) => {
    const { coins } = get();
    if (coins < amount) return false;
    set({ coins: coins - amount });
    return true;
  },
  addCoins: (amount) => set({ coins: get().coins + amount }),
}));

// Coin costs
export const COIN_COSTS = {
  read1: 0,
  read3: 3,
  read5: 5,
  aiRead: 2,
  chatMessage: 1,
} as const;

export const FREE_READS_PER_DAY = 3;

// Coin packages
export const COIN_PACKAGES = [
  { id: "starter", name: "Starter", coins: 50, price: "9.000đ", emoji: "🥉", popular: false },
  { id: "popular", name: "Popular", coins: 150, price: "19.000đ", emoji: "🥈", popular: true },
  { id: "pro", name: "Pro", coins: 500, price: "49.000đ", emoji: "🥇", popular: false },
];
