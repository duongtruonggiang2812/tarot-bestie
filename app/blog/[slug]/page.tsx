import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButton from "@/components/ShareButton";

export const revalidate = 60;
export const dynamicParams = true;

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  cover_emoji: string;
  reading_time: number;
  published_at: string | null;
  created_at: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/blog/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post ?? null;
  } catch {
    return null;
  }
}

async function getRelated(currentSlug: string, tags: string[]): Promise<Post[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/blog?limit=20`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const all: Post[] = data.posts ?? [];
    return all
      .filter((p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t)))
      .slice(0, 2);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${SITE_URL}/api/blog?limit=100`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.posts ?? []).map((p: Post) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
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
      publishedTime: post.published_at ?? post.created_at,
      tags: post.tags,
    },
  };
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(slug, post.tags);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.published_at ?? post.created_at,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    keywords: post.tags.join(", "),
    inLanguage: "vi",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-celestial">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 glass border-b border-white/40 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-purple-deep/70 font-body font-semibold text-sm hover:text-purple-deep transition-colors"
            >
              ← Blog
            </Link>
            <span className="font-display font-bold text-purple-deep text-sm truncate max-w-[160px]">
              {post.cover_emoji} {post.title}
            </span>
            <div className="w-16" />
          </div>
        </div>

        {/* Reading progress bar */}
        <ReadingProgress />

        {/* Hero header */}
        <div
          className="w-full py-14 px-4 text-white text-center"
          style={{ background: "linear-gradient(135deg, #7B4FA6 0%, #9B6CC7 50%, #E8739A 100%)" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-[80px] leading-none mb-5">{post.cover_emoji}</div>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-body font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/20 text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="font-body text-white/70 text-base leading-relaxed mb-5 max-w-xl mx-auto">
              {post.description}
            </p>
            <p className="font-body text-white/50 text-sm">
              {formatDate(post.published_at ?? post.created_at)} · {post.reading_time} phút đọc
            </p>
          </div>
        </div>

        {/* Article content */}
        <article className="max-w-2xl mx-auto px-4 py-10">
          <div
            className="
              font-body text-purple-deep/80 leading-relaxed
              [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-purple-deep [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-purple-mid [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-5 [&_p]:text-base [&_p]:leading-[1.8]
              [&_ul]:mb-5 [&_ul]:pl-6 [&_ul]:list-disc
              [&_ol]:mb-5 [&_ol]:pl-6 [&_ol]:list-decimal
              [&_li]:mb-2 [&_li]:leading-relaxed
              [&_strong]:text-purple-deep [&_strong]:font-bold
              [&_em]:italic [&_em]:text-purple-mid
              [&_blockquote]:border-l-4 [&_blockquote]:border-purple-mid/40 [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-purple-deep/60 [&_blockquote]:italic
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-10 flex items-center gap-3">
            <span className="font-body text-sm text-purple-deep/50">Chia sẻ bài viết:</span>
            <ShareButton title={post.title} />
          </div>

          {/* CTA */}
          <div
            className="mt-12 p-8 rounded-3xl text-center text-white"
            style={{ background: "linear-gradient(135deg, #7B4FA6, #E8739A)" }}
          >
            <p className="font-display font-bold text-2xl mb-2">
              Rút bài ngay 🔮
            </p>
            <p className="font-body text-white/75 text-sm mb-5">
              Rút bài miễn phí, Thần Bài giải mã tiếng Việt chuẩn xác
            </p>
            <Link href="/reading">
              <button className="px-7 py-3 rounded-full font-body font-bold text-purple-deep bg-white hover:bg-white/90 transition-colors text-sm shadow-lg">
                🃏 Rút bài ngay
              </button>
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="font-display font-bold text-purple-deep text-xl mb-4">
                Bài viết liên quan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
                    <div className="glass rounded-xl p-4 border border-white/50 hover:border-purple-mid/40 transition-all flex items-center gap-3 hover:shadow-md">
                      <span className="text-2xl shrink-0">{r.cover_emoji}</span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-purple-deep text-sm leading-snug line-clamp-2 group-hover:text-purple-mid transition-colors">
                          {r.title}
                        </p>
                        <p className="font-body text-purple-deep/50 text-xs mt-0.5">
                          {r.reading_time} phút đọc
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
