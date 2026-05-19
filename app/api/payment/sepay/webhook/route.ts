import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// SePay sends: Authorization: Apikey YOUR_API_KEY
const SEPAY_API_KEY = process.env.SEPAY_API_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    // Verify SePay API key
    const authHeader = req.headers.get("Authorization") ?? "";
    const incomingKey = authHeader.replace("Apikey ", "").trim();

    if (SEPAY_API_KEY && incomingKey !== SEPAY_API_KEY) {
      console.error("[sepay/webhook] Invalid API key");
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const body = await req.json();
    console.log("[sepay/webhook]", body);

    const {
      transferType,   // "in" = incoming money
      transferAmount, // amount in VND
      content,        // transfer note
    } = body;

    // Only handle incoming transfers
    if (transferType !== "in") {
      return NextResponse.json({ success: true });
    }

    // Extract order code from transfer content (e.g. "TAROTABC123")
    const match = (content as string)?.match(/TAROT[A-Z0-9]{6}/);
    if (!match) {
      return NextResponse.json({ success: true }); // Not our payment, ignore
    }
    const orderCode = match[0];

    // Find pending transaction
    const { data: txn } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", orderCode)
      .eq("status", "pending")
      .single();

    if (!txn) {
      return NextResponse.json({ success: true }); // Already processed or not found
    }

    // Verify amount matches (allow ±1000 tolerance for bank fees)
    if (Math.abs(transferAmount - txn.amount_vnd) > 1000) {
      console.error(`[sepay/webhook] Amount mismatch: got ${transferAmount}, expected ${txn.amount_vnd}`);
      await supabase.from("transactions").update({ status: "amount_mismatch" }).eq("id", orderCode);
      return NextResponse.json({ success: true });
    }

    // Mark transaction success
    const { error: updateErr } = await supabase
      .from("transactions")
      .update({ status: "success" })
      .eq("id", orderCode)
      .eq("status", "pending"); // idempotency guard

    if (updateErr) throw updateErr;

    // Add coins to user
    await supabase.rpc("add_coins", {
      p_user_id: txn.user_id,
      p_amount: txn.coins,
    });

    console.log(`[sepay/webhook] ✅ ${orderCode}: +${txn.coins} xu for user ${txn.user_id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[sepay/webhook] Error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
