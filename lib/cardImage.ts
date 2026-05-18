import { TarotCard } from "@/data/tarotCards";

const SUIT_PREFIX: Record<string, string> = {
  wands: "wa",
  cups: "cu",
  swords: "sw",
  pentacles: "pe",
};

// Court cards have string numbers, map them to file numbers 11-14
const COURT_NUMBER: Record<string, string> = {
  Page: "11",
  Knight: "12",
  Queen: "13",
  King: "14",
};

export function getCardImageUrl(card: TarotCard): string {
  if (card.arcana === "major") {
    const num = String(card.id).padStart(2, "0");
    return `/cards/ar${num}.jpg`;
  }
  const prefix = SUIT_PREFIX[card.suit!];
  const rawNum = card.number;
  const num =
    typeof rawNum === "string" && COURT_NUMBER[rawNum]
      ? COURT_NUMBER[rawNum]
      : String(rawNum).padStart(2, "0");
  return `/cards/${prefix}${num}.jpg`;
}
