"use client";

import { useState } from "react";

interface Props {
  title: string;
}

export default function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={`Sao chép link: ${title}`}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-semibold border border-purple-deep/20 text-purple-deep/70 hover:bg-purple-deep/5 transition-colors"
    >
      {copied ? "✓ Đã sao chép!" : "🔗 Sao chép link"}
    </button>
  );
}
