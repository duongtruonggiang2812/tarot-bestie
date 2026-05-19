import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { SEO, SITE_URL, SITE_NAME } from "@/lib/seo";

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

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Tarot Bestie",
  url: `${SITE_URL}/blog`,
  description: "Kiến thức tarot tiếng Việt từ cơ bản đến nâng cao",
  blogPost: BLOG_POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE_URL}/blog/${p.slug}`,
    datePublished: p.date,
    description: p.description,
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div className="min-h-screen bg-celestial">
        {/* Header */}
        <div className="sticky top-0 z-20 glass border-b border-white/40 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-purple-deep/70 font-body font-semibold text-sm hover:text-purple-deep transition-colors"
            >
              ← Trang chủ
            </Link>
            <span className="font-display font-bold text-purple-deep">📚 Blog Tarot</span>
            <div className="w-16" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-purple-deep mb-3">
              Blog Tarot 🔮
            </h1>
            <p className="font-body text-purple-deep/60">
              Kiến thức tarot tiếng Việt — từ cơ bản đến nâng cao
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="glass rounded-2xl p-6 border border-white/50 hover:border-purple-mid/40 transition-all hover:shadow-lg group">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl shrink-0">{post.coverEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-body font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-deep/8 text-purple-deep/60"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] font-body text-purple-deep/35">
                          {post.readingTime} phút đọc
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-purple-deep text-base leading-snug group-hover:text-purple-mid transition-colors mb-1">
                        {post.title}
                      </h2>
                      <p className="font-body text-purple-deep/55 text-sm leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
