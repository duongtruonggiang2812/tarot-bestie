"use client";

import { useEffect, useState } from "react";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /FBAN|FBAV|Instagram|Line\/|KAKAOTALK|ZaloApp|Messenger/i.test(ua) ||
    (/iPhone|iPad/.test(ua) && !/Safari\//.test(ua) && /WebKit/i.test(ua) && !/Chrome/i.test(ua))
  );
}

export default function InAppBrowserWarning() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShow(isInAppBrowser());
  }, []);

  if (!show) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="rounded-3xl p-7 max-w-sm w-full text-center flex flex-col items-center gap-5 shadow-2xl"
        style={{ background: "linear-gradient(160deg, #1a1030 0%, #0d0820 100%)", border: "1px solid rgba(212,168,71,0.3)" }}>

        <div className="text-5xl">🔮</div>

        <div>
          <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#e8d5a3" }}>
            Mở bằng trình duyệt thật nhé!
          </h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(232,213,163,0.65)" }}>
            Google không cho phép đăng nhập trong trình duyệt của Messenger, Facebook hay Instagram.
            <br /><br />
            Hãy mở <strong style={{ color: "#e8d5a3" }}>Safari</strong> hoặc <strong style={{ color: "#e8d5a3" }}>Chrome</strong> rồi dán link vào nhé!
          </p>
        </div>

        <button onClick={handleCopy}
          className="w-full py-3.5 px-6 rounded-2xl font-body font-bold text-sm transition-all"
          style={{
            background: copied
              ? "linear-gradient(135deg, #059669, #10b981)"
              : "linear-gradient(135deg, #d4a847, #f0c060, #b8860b)",
            color: copied ? "white" : "#1a0e00",
          }}>
          {copied ? "✓ Đã copy link!" : "📋 Copy link để mở"}
        </button>

        <p className="font-body text-xs" style={{ color: "rgba(232,213,163,0.35)" }}>
          {url.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </div>
  );
}
