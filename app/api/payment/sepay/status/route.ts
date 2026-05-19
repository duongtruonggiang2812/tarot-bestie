/**
 * GET /api/payment/sepay/status?orderCode=TAROTXXXXXX
 *
 * Frontend poll mỗi 4 giây để biết đơn đã được xác nhận chưa.
 * Trả về: { status: "pending" | "success" | "expired" | "wrong_amount" }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderCode = req.nextUrl.searchParams.get("orderCode");
  if (!orderCode) {
    return NextResponse.json({ error: "Thiếu orderCode" }, { status: 400 });
  }

  const { data: txn } = await supabase
    .from("transactions")
    .select("status, coins, expires_at")
    .eq("id", orderCode)
    .eq("user_id", session.user.id) // Chỉ truy cập đơn của chính mình
    .single();

  if (!txn) return NextResponse.json({ status: "not_found" });

  // Tự động expire nếu quá 15 phút
  if (txn.status === "pending" && new Date(txn.expires_at) < new Date()) {
    await supabase.from("transactions").update({ status: "expired" }).eq("id", orderCode);
    return NextResponse.json({ status: "expired" });
  }

  return NextResponse.json({ status: txn.status, coins: txn.coins });
}
