import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { SEO, SITE_URL, SITE_NAME, webAppSchema, faqSchema, orgSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.title.default,
  description: SEO.description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SEO.title.default,
    description: SEO.description,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: SEO.og.image, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomePageClient />
    </>
  );
}
