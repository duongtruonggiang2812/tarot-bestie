import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const DAILY_BONUS_COINS = 3;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ bonus: false, error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ bonus: false });

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const { data: user } = await admin
    .from("users")
    .select("coins, last_daily_bonus")
    .eq("id", session.user.id)
    .single();

  if (!user) return NextResponse.json({ bonus: false });

  // Đã điểm danh hôm nay rồi
  if (user.last_daily_bonus === today) {
    return NextResponse.json({ bonus: false, coins: user.coins });
  }

  // Cộng xu điểm danh
  const newCoins = (user.coins ?? 0) + DAILY_BONUS_COINS;
  await admin
    .from("users")
    .update({ coins: newCoins, last_daily_bonus: today })
    .eq("id", session.user.id);

  return NextResponse.json({ bonus: true, coins: newCoins, amount: DAILY_BONUS_COINS });
}
