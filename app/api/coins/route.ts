import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ coins: 0, freeReadsToday: 0 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ coins: 20, freeReadsToday: 0 });

  const { data } = await admin
    .from("users")
    .select("coins, free_reads_today, last_reset")
    .eq("id", session.user.id)
    .single();

  if (!data) return NextResponse.json({ coins: 20, freeReadsToday: 0 });

  const today = new Date().toISOString().slice(0, 10);
  if (data.last_reset !== today) {
    await admin.from("users").update({ free_reads_today: 0, last_reset: today }).eq("id", session.user.id);
    return NextResponse.json({ coins: data.coins, freeReadsToday: 0 });
  }
  return NextResponse.json({ coins: data.coins, freeReadsToday: data.free_reads_today });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ success: true, coins: 20 });

  const { action, amount } = await req.json();

  if (action === "spend") {
    const { data } = await admin.from("users").select("coins").eq("id", session.user.id).single();
    if (!data || data.coins < amount) return NextResponse.json({ error: "Không đủ xu" }, { status: 400 });
    await admin.from("users").update({ coins: data.coins - amount }).eq("id", session.user.id);
    return NextResponse.json({ success: true, coins: data.coins - amount });
  }

  if (action === "free_read") {
    const { data } = await admin.from("users").select("free_reads_today").eq("id", session.user.id).single();
    const current = data?.free_reads_today ?? 0;
    await admin.from("users").update({ free_reads_today: current + 1 }).eq("id", session.user.id);
    return NextResponse.json({ success: true, freeReadsToday: current + 1 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
