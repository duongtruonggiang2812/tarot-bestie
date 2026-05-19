import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getSupabaseAdmin } from "@/lib/supabase";

export const revalidate = 3600; // refresh sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/reading`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/coins`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  // Fetch published blog posts from Supabase
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data } = await admin
        .from("blog_posts")
        .select("slug, published_at, updated_at")
        .eq("published", true)
        .order("published_at", { ascending: false });

      blogRoutes = (data ?? []).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at ?? post.published_at ?? now),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // fallback gracefully — sitemap still works without blog routes
  }

  return [...staticRoutes, ...blogRoutes];
}
