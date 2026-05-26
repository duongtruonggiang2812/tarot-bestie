import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import InAppBrowserWarning from "@/components/InAppBrowserWarning";
import { SEO, SITE_URL, SITE_NAME } from "@/lib/seo";

const GA_ID = "G-H7SFM5Z6E2";

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
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        <Providers>
          <InAppBrowserWarning />
          {children}
        </Providers>
      </body>
    </html>
  );
}
