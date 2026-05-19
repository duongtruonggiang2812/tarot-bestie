/**
 * POST /api/payment/sepay/create
 *
 * Flow:
 * 1. Tạo mã đơn duy nhất (VD: TAROT4F9K2M)
 * 2. Lưu transaction vào DB với status "pending"
 * 3. Trả về thông tin ngân hàng + URL QR (VietQR)
 * 4. Frontend hiển thị QR cho user quét & chuyển khoản
 * 5. User chuyển khoản với nội dung = mã đơn
 * 6. SePay phát hiện → gọi webhook → server xác nhận → cộng xu
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { COIN_PACKAGES } from "@/store/coinStore";

function genOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "TAROT";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
  }

  const { packageId } = await req.json();
  const pkg = COIN_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Gói không tồn tại" }, { status: 400 });
  }

  const orderCode = genOrderCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Lỗi cấu hình server" }, { status: 500 });

  const { error } = await admin.from("transactions").insert({
    id:         orderCode,
    user_id:    session.user.id,
    package_id: packageId,
    coins:      pkg.coins,
    amount_vnd: pkg.priceRaw,
    status:     "pending",
    expires_at: expiresAt,
  });

  if (error) {
    console.error("[sepay/create]", error);
    return NextResponse.json({ error: "Không thể tạo đơn hàng" }, { status: 500 });
  }

  const bankId      = process.env.BANK_ID           ?? "MB";
  const accountNo   = process.env.BANK_ACCOUNT_NO   ?? "0000000000";
  const accountName = process.env.BANK_ACCOUNT_NAME ?? "TAROT BESTIE";

  // VietQR — QR chuẩn cho mọi ngân hàng Việt Nam
  const qrUrl =
    `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg` +
    `?amount=${pkg.priceRaw}` +
    `&addInfo=${encodeURIComponent(orderCode)}` +
    `&accountName=${encodeURIComponent(accountName)}`;

  return NextResponse.json({
    orderCode,
    amount:      pkg.priceRaw,
    coins:       pkg.coins,
    packageName: pkg.name,
    bankId,
    accountNo,
    accountName,
    qrUrl,
    expiresAt,
  });
}
