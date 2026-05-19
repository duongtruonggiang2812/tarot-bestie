import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import BlogTagFilter from "@/components/BlogTagFilter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog Tarot — Kiến Thức Tarot Tiếng Việt",
  description:
    "Tổng hợp bài viết về ý nghĩa lá bài tarot, cách đọc bài, tarot tình yêu, sự nghiệp bằng tiếng Việt dễ hiểu.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog Tarot | Tarot Bestie",
    description: "Kiến thức tarot tiếng Việt từ cơ bản đến nâng cao.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
  },
};

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  cover_emoji: string;
  reading_time: number;
  published_at: string | null;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/blog?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Tarot Bestie",
    url: `${SITE_URL}/blog`,
    description: "Kiến thức tarot tiếng Việt từ cơ bản đến nâng cao",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.published_at ?? p.created_at,
      description: p.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div className="min-h-screen bg-celestial">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 glass border-b border-white/40 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-purple-deep/70 font-body font-semibold text-sm hover:text-purple-deep transition-colors"
            >
              ← Trang chủ
            </Link>
            <span className="font-display font-bold text-purple-deep">📚 Blog Tarot</span>
            <div className="w-20" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-purple-deep mb-3">
              Blog Tarot 🔮
            </h1>
            <p className="font-body text-purple-deep/60">
              Kiến thức tarot tiếng Việt — từ cơ bản đến nâng cao
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24 text-purple-deep/40 font-body">
              <div className="text-6xl mb-4">🃏</div>
              <p className="text-lg">Chưa có bài viết nào.</p>
              <p className="text-sm mt-2">Hãy quay lại sau nhé!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <section aria-label="Bài viết nổi bật" className="mb-8">
                  <Link href={`/blog/${featured.slug}`} className="group block">
                    <article
                      className="rounded-3xl p-8 text-white relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #7B4FA6 0%, #9B6CC7 50%, #E8739A 100%)" }}
                    >
                      {/* Background shimmer */}
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }}
                      />

                      <div className="relative">
                        {/* Emoji */}
                        <div className="text-7xl mb-4 leading-none">{featured.cover_emoji}</div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {featured.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-body font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-white/20 text-white/90"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug mb-3 group-hover:opacity-90 transition-opacity">
                          {featured.title}
                        </h2>

                        {/* Description */}
                        <p className="font-body text-white/75 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
                          {featured.description}
                        </p>

                        {/* Meta + CTA */}
                        <div className="flex items-center justify-between">
                          <p className="font-body text-white/55 text-xs">
                            {formatDate(featured.published_at ?? featured.created_at)} · {featured.reading_time} phút đọc
                          </p>
                          <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/20 text-white font-body font-bold text-sm group-hover:bg-white/30 transition-colors">
                            Đọc ngay →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </section>
              )}

              {/* Tag filters + grid (client component) */}
              <section aria-label="Danh sách bài viết">
                <BlogTagFilter posts={rest} allTags={allTags} />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
