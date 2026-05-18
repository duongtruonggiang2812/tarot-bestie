import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

// Thêm email admin ở đây (hoặc dùng env var ADMIN_EMAILS)
const HARDCODED_ADMINS = ["duongtruonggiang2812@gmail.com", "truonggiangduong2812@gmail.com"];
const ADMIN_EMAILS = [
  ...HARDCODED_ADMINS,
  ...(process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// GET /api/admin — danh sách tất cả users
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = 20;
  const from = (page - 1) * limit;

  let query = admin
    .from("users")
    .select("id, email, name, avatar, coins, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data, total: count ?? 0, page, limit });
}

// POST /api/admin — cập nhật xu của user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const { userId, action, amount } = await req.json();
  if (!userId || !action || typeof amount !== "number") {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const { data: user } = await admin.from("users").select("coins").eq("id", userId).single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let newCoins = user.coins;
  if (action === "set") newCoins = Math.max(0, amount);
  if (action === "add") newCoins = Math.max(0, user.coins + amount);
  if (action === "subtract") newCoins = Math.max(0, user.coins - amount);

  await admin.from("users").update({ coins: newCoins }).eq("id", userId);
  return NextResponse.json({ success: true, coins: newCoins });
}
