import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const HARDCODED_ADMINS = ["duongtruonggiang2812@gmail.com", "truonggiangduong2812@gmail.com"];
const ADMIN_EMAILS = [
  ...HARDCODED_ADMINS,
  ...(process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// GET /api/admin — danh sách users kèm stats sử dụng
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
    .select("id, email, name, avatar, coins, coins_spent, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data: users, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch readings stats for users on this page
  const userIds = (users ?? []).map((u) => u.id);
  let readingStats: Record<string, { count: number; last_active: string }> = {};

  if (userIds.length > 0) {
    const { data: readings } = await admin
      .from("readings")
      .select("user_id, created_at")
      .in("user_id", userIds);

    readingStats = (readings ?? []).reduce(
      (acc: Record<string, { count: number; last_active: string }>, r) => {
        if (!acc[r.user_id]) acc[r.user_id] = { count: 0, last_active: r.created_at };
        acc[r.user_id].count++;
        if (r.created_at > acc[r.user_id].last_active) acc[r.user_id].last_active = r.created_at;
        return acc;
      },
      {}
    );
  }

  // Fetch global summary stats
  const [{ count: totalReadings }, { data: activeUsers }] = await Promise.all([
    admin.from("readings").select("*", { count: "exact", head: true }),
    admin
      .from("readings")
      .select("user_id")
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
  ]);

  const activeUserCount = new Set((activeUsers ?? []).map((r) => r.user_id)).size;

  const enrichedUsers = (users ?? []).map((u) => ({
    ...u,
    coins_spent: u.coins_spent ?? 0,
    readings_count: readingStats[u.id]?.count ?? 0,
    last_active: readingStats[u.id]?.last_active ?? null,
  }));

  return NextResponse.json({
    users: enrichedUsers,
    total: count ?? 0,
    page,
    limit,
    summary: {
      total_readings: totalReadings ?? 0,
      active_users_7d: activeUserCount,
    },
  });
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

  const { data: user } = await admin
    .from("users")
    .select("coins, coins_spent")
    .eq("id", userId)
    .single();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let newCoins = user.coins;
  if (action === "set") newCoins = Math.max(0, amount);
  if (action === "add") newCoins = Math.max(0, user.coins + amount);
  if (action === "subtract") newCoins = Math.max(0, user.coins - amount);

  await admin.from("users").update({ coins: newCoins }).eq("id", userId);
  return NextResponse.json({ success: true, coins: newCoins });
}
