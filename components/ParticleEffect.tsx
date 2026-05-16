"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  emoji: string;
}

const EMOJIS = ["✨", "⭐", "🌟", "💫", "🔮", "🌙", "⚡"];

export default function ParticleEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create background twinkling stars
    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.className = "star absolute text-xs pointer-events-none select-none";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${1.5 + Math.random() * 2}s`);
      star.style.setProperty("--delay", `${Math.random() * 2}s`);
      star.textContent = EMOJIS[Math.floor(Math.random() * 3)];
      container.appendChild(star);
      stars.push(star);
    }

    // Periodic particle burst
    const createParticleBurst = () => {
      if (!container) return;

      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

      const el = document.createElement("div");
      el.className = "particle absolute pointer-events-none select-none text-sm";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.textContent = emoji;
      container.appendChild(el);

      setTimeout(() => {
        if (container.contains(el)) {
          container.removeChild(el);
        }
      }, 2000);
    };

    const interval = setInterval(createParticleBurst, 800);

    return () => {
      clearInterval(interval);
      stars.forEach((s) => {
        if (container.contains(s)) container.removeChild(s);
      });
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
