import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import InAppBrowserWarning from "@/components/InAppBrowserWarning";
import { SEO, SITE_URL, SITE_NAME } from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: SEO.og.type,
    locale: SEO.og.locale,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO.title.default,
    description: SEO.description,
    images: [{ url: SEO.og.image, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: SEO.twitter.card,
    title: SEO.title.default,
    description: SEO.description,
    images: [SEO.og.image],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "vi-VN": SITE_URL },
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <InAppBrowserWarning />
          {children}
        </Providers>
      </body>
    </html>
  );
}
