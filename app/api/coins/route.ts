import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET — trả về số xu hiện tại của user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ coins: 0 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ coins: 20 });

  const { data } = await admin
    .from("users")
    .select("coins")
    .eq("id", session.user.id)
    .single();

  return NextResponse.json({ coins: data?.coins ?? 20 });
}

// POST — tiêu xu (chỉ dùng cho aiRead và chatMessage)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ success: true });

  const { action, amount } = await req.json();

  if (action === "spend" && amount > 0) {
    const { data } = await admin
      .from("users")
      .select("coins")
      .eq("id", session.user.id)
      .single();

    if (!data || data.coins < amount) {
      return NextResponse.json({ error: "Không đủ xu" }, { status: 400 });
    }

    await admin
      .from("users")
      .update({ coins: data.coins - amount })
      .eq("id", session.user.id);

    return NextResponse.json({ success: true, coins: data.coins - amount });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
