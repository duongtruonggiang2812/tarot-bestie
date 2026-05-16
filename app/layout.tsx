import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tarot Bestie 🔮 | Xem bói online cho Gen Z",
  description:
    "Khám phá bí ẩn của tarot cùng AI. Xem bói tình yêu, sự nghiệp, tài chính và bản thân theo phong cách Gen Z.",
  keywords: "tarot, xem bói, tarot online, tình yêu, sự nghiệp, gen z",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
