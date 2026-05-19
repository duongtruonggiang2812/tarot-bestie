import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllSlugs, BLOG_POSTS } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: post.tags.join(", "),
    inLanguage: "vi",
  };

  // Related posts (same tags, exclude current)
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))
  ).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-celestial">
        {/* Header */}
        <div className="sticky top-0 z-20 glass border-b border-white/40 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-purple-deep/70 font-body font-semibold text-sm hover:text-purple-deep transition-colors"
            >
              ← Blog
            </Link>
            <span className="font-display font-bold text-purple-deep">📚</span>
            <div className="w-16" />
          </div>
        </div>

        <article className="max-w-2xl mx-auto px-4 py-10">
          {/* Cover */}
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">{post.coverEmoji}</span>
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-body font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-purple-deep/8 text-purple-deep/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-purple-deep leading-tight mb-3">
              {post.title}
            </h1>
            <p className="font-body text-purple-deep/55 text-base leading-relaxed mb-4">
              {post.description}
            </p>
            <p className="font-body text-purple-deep/35 text-sm">
              {new Date(post.date).toLocaleDateString("vi-VN", {
                year: "numeric", month: "long", day: "numeric",
              })}
              {" · "}{post.readingTime} phút đọc
            </p>
          </div>

          {/* Content */}
          <div
            className="prose prose-purple max-w-none font-body text-purple-deep/80 leading-relaxed
              [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-purple-deep [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-3
              [&_p]:mb-4 [&_p]:text-base
              [&_strong]:text-purple-deep [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 rounded-2xl text-center"
            style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.08))" }}>
            <p className="font-display font-bold text-purple-deep text-xl mb-2">
              Muốn thử rút bài ngay? 🔮
            </p>
            <p className="font-body text-purple-deep/60 text-sm mb-4">
              Rút bài miễn phí, AI đọc bài tiếng Việt
            </p>
            <Link href="/reading">
              <button className="px-6 py-3 rounded-full font-body font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                🃏 Rút bài ngay
              </button>
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display font-bold text-purple-deep text-xl mb-4">
                Bài viết liên quan
              </h3>
              <div className="flex flex-col gap-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}>
                    <div className="glass rounded-xl p-4 border border-white/50 hover:border-purple-mid/40 transition-all flex items-center gap-3">
                      <span className="text-2xl">{r.coverEmoji}</span>
                      <div>
                        <p className="font-display font-bold text-purple-deep text-sm leading-snug">
                          {r.title}
                        </p>
                        <p className="font-body text-purple-deep/50 text-xs mt-0.5">
                          {r.readingTime} phút đọc
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
