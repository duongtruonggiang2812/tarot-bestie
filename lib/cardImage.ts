import { TarotCard } from "@/data/tarotCards";

const SUIT_PREFIX: Record<string, string> = {
  wands: "wa",
  cups: "cu",
  swords: "sw",
  pentacles: "pe",
};

export function getCardImageUrl(card: TarotCard): string {
  if (card.arcana === "major") {
    const num = String(card.id).padStart(2, "0");
    return `/cards/ar${num}.jpg`;
  }
  const prefix = SUIT_PREFIX[card.suit!];
  const num = String(card.number).padStart(2, "0");
  return `/cards/${prefix}${num}.jpg`;
}
