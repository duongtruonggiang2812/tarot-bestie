import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { COIN_PACKAGES } from "@/store/coinStore";

// Generate short unique code: TAROT + 6 uppercase chars
function genOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TAROT";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: NextRequest) {
  try {
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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 phút

    // Save pending transaction
    const { error } = await supabase.from("transactions").insert({
      id: orderCode,
      user_id: session.user.id,
      package_id: packageId,
      coins: pkg.coins,
      amount_vnd: pkg.priceRaw,
      status: "pending",
      expires_at: expiresAt,
    });

    if (error) throw error;

    // Build VietQR URL (works for all Vietnamese banks)
    const bankId      = process.env.BANK_ID          ?? "MB";      // MB, VCB, TCB...
    const accountNo   = process.env.BANK_ACCOUNT_NO  ?? "0000000000";
    const accountName = process.env.BANK_ACCOUNT_NAME ?? "TAROT BESTIE";
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${pkg.priceRaw}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`;

    return NextResponse.json({
      orderCode,
      amount: pkg.priceRaw,
      coins: pkg.coins,
      packageName: pkg.name,
      bankId,
      accountNo,
      accountName,
      qrUrl,
      expiresAt,
    });
  } catch (err) {
    console.error("[sepay/create]", err);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
