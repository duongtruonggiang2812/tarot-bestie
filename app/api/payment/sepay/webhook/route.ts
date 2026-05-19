/**
 * POST /api/payment/sepay/webhook
 *
 * SePay gọi endpoint này khi phát hiện giao dịch ngân hàng mới.
 * SePay tự động trích xuất "code" từ nội dung chuyển khoản.
 *
 * Header: Authorization: Apikey <SEPAY_API_KEY>
 *
 * Payload mẫu từ SePay:
 * {
 *   "id": 12345,
 *   "gateway": "MBBank",
 *   "transactionDate": "2025-05-19 12:00:00",
 *   "accountNumber": "0123456789",
 *   "code": "TAROTABC123",          ← mã đơn được SePay tự extract
 *   "content": "chuyen khoan TAROTABC123",
 *   "transferType": "in",           ← "in" = tiền vào
 *   "transferAmount": 80000,
 *   "referenceCode": "FT25001..."
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const SEPAY_API_KEY = process.env.SEPAY_API_KEY ?? "";

export async function POST(req: NextRequest) {
  // 1. Xác thực webhook từ SePay
  const auth = req.headers.get("Authorization") ?? "";
  if (SEPAY_API_KEY && auth !== `Apikey ${SEPAY_API_KEY}`) {
    console.warn("[sepay/webhook] Unauthorized request");
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  console.log("[sepay/webhook] Received:", JSON.stringify(body));

  const { transferType, transferAmount, code } = body as {
    transferType: string;
    transferAmount: number;
    code: string;
  };

  // 2. Chỉ xử lý giao dịch tiền VÀO
  if (transferType !== "in") {
    return NextResponse.json({ success: true });
  }

  // 3. Kiểm tra mã đơn hợp lệ (TAROT + 6 ký tự)
  if (!code || !/^TAROT[A-Z0-9]{6}$/.test(code)) {
    return NextResponse.json({ success: true }); // Không phải đơn của mình, bỏ qua
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ success: false }, { status: 500 });

  // 4. Tìm đơn hàng đang chờ
  const { data: txn, error: findErr } = await admin
    .from("transactions")
    .select("user_id, coins, amount_vnd")
    .eq("id", code)
    .eq("status", "pending")
    .single();

  if (findErr || !txn) {
    // Đơn không tồn tại hoặc đã xử lý rồi → vẫn trả 200 để SePay không retry
    return NextResponse.json({ success: true });
  }

  // 5. Kiểm tra số tiền (cho phép lệch ±1.000đ do phí ngân hàng)
  if (Math.abs(transferAmount - txn.amount_vnd) > 1000) {
    console.error(`[sepay/webhook] Số tiền không khớp: nhận ${transferAmount}, cần ${txn.amount_vnd}`);
    await admin.from("transactions").update({ status: "wrong_amount" }).eq("id", code);
    return NextResponse.json({ success: true });
  }

  // 6. Đánh dấu thành công (dùng eq status=pending để đảm bảo idempotent)
  const { error: updateErr } = await admin
    .from("transactions")
    .update({ status: "success" })
    .eq("id", code)
    .eq("status", "pending");

  if (updateErr) {
    console.error("[sepay/webhook] Update error:", updateErr);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // 7. Cộng xu vào tài khoản user
  const { error: rpcErr } = await admin.rpc("add_coins", {
    p_user_id: txn.user_id,
    p_amount:  txn.coins,
  });

  if (rpcErr) {
    console.error("[sepay/webhook] add_coins error:", rpcErr);
    // Rollback status để có thể retry
    await admin.from("transactions").update({ status: "pending" }).eq("id", code);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  console.log(`[sepay/webhook] ✅ ${code}: +${txn.coins} xu → user ${txn.user_id}`);
  return NextResponse.json({ success: true });
}
