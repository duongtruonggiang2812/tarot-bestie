"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCoinStore } from "@/store/coinStore";
import CoinBadge from "@/components/CoinBadge";
import PurchaseModal from "@/components/PurchaseModal";

export default function Header() {
  const { data: session, status } = useSession();
  const { setCoins, setFreeReads } = useCoinStore();
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/coins")
        .then((r) => r.json())
        .then((data) => {
          if (data.coins !== undefined) setCoins(data.coins);
          if (data.freeReadsToday !== undefined) setFreeReads(data.freeReadsToday);
        })
        .catch(() => {});
    }
  }, [status, setCoins, setFreeReads]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="font-display font-bold text-purple-deep text-lg">
            🔮 Tarot Bestie
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {status === "authenticated" && session?.user ? (
              <>
                {/* Coin badge */}
                <CoinBadge />

                {/* Avatar + name */}
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "Avatar"}
                      className="w-7 h-7 rounded-full border-2 border-purple-mid/40 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-lavender border-2 border-purple-mid/40 flex items-center justify-center text-xs font-bold text-purple-deep">
                      {session.user.name?.[0] ?? "U"}
                    </div>
                  )}
                  <span className="font-body text-purple-deep text-sm font-semibold hidden sm:block max-w-[100px] truncate">
                    {session.user.name?.split(" ").pop()}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="text-xs font-body text-purple-deep/50 hover:text-purple-deep transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-deep to-purple-mid text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-shadow"
              >
                <span>🌟</span>
                <span>Đăng nhập Google</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <PurchaseModal isOpen={showPurchase} onClose={() => setShowPurchase(false)} />
    </>
  );
}
