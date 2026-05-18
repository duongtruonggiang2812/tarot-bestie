"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCoinStore } from "@/store/coinStore";
import CoinBadge from "@/components/CoinBadge";

export default function Header() {
  const { data: session, status } = useSession();
  const { setCoins } = useCoinStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      // Lấy số xu hiện tại
      fetch("/api/coins")
        .then((r) => r.json())
        .then((data) => {
          if (data.coins !== undefined) {
            const isNew = data.coins === 10 && !localStorage.getItem("welcomed");
            if (isNew) {
              setShowWelcome(true);
              localStorage.setItem("welcomed", "1");
              setTimeout(() => setShowWelcome(false), 5000);
            }
            setCoins(data.coins);
          }
        })
        .catch(() => {});

      // Điểm danh hàng ngày
      fetch("/api/daily-bonus", { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          if (data.bonus) {
            setCoins(data.coins);
            setShowDailyBonus(true);
            setTimeout(() => setShowDailyBonus(false), 5000);
          }
        })
        .catch(() => {});
    }
  }, [status, setCoins]);

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

      {/* Daily bonus toast */}
      {showDailyBonus && (
        <div
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "white", borderRadius: 16, padding: "12px 20px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 32px rgba(5,150,105,0.35)",
            zIndex: 100, whiteSpace: "nowrap", animation: "fadeIn 0.4s ease",
          }}
        >
          <span style={{ fontSize: 22 }}>📅</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Điểm danh hôm nay! +3 xu 🪙</p>
            <p style={{ fontSize: 11, opacity: 0.85, margin: 0 }}>Quay lại mỗi ngày để nhận thêm nhé!</p>
          </div>
          <span style={{ fontSize: 20, marginLeft: 4 }}>✨</span>
        </div>
      )}

      {/* Welcome bonus toast */}
      {showWelcome && (
        <div
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "white", borderRadius: 16, padding: "12px 20px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
            zIndex: 100, whiteSpace: "nowrap", animation: "fadeIn 0.4s ease",
          }}
        >
          <span style={{ fontSize: 22 }}>🎁</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Chào mừng bestie! Tặng bạn 10 xu 🪙</p>
            <p style={{ fontSize: 11, opacity: 0.85, margin: 0 }}>Dùng xu để xem bói và chat với AI nhé!</p>
          </div>
          <span style={{ fontSize: 20, marginLeft: 4 }}>✨</span>
        </div>
      )}
    </>
  );
}
