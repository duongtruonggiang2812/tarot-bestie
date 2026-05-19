"use client";

import { useState } from "react";
import Link from "next/link";

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

interface Props {
  posts: Post[];
  allTags: string[];
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogTagFilter({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string>("all");

  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <>
      {/* Tag filter chips */}
      <div className="flex gap-2 flex-wrap mb-8" aria-label="Lọc theo chủ đề">
        <button
          onClick={() => setActiveTag("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold transition-all ${
            activeTag === "all"
              ? "bg-purple-deep text-white shadow-sm"
              : "bg-white/50 text-purple-deep/70 border border-purple-deep/20 hover:bg-white/80"
          }`}
        >
          Tất cả
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold capitalize transition-all ${
              activeTag === tag
                ? "bg-purple-deep text-white shadow-sm"
                : "bg-white/50 text-purple-deep/70 border border-purple-deep/20 hover:bg-white/80"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-purple-deep/40 font-body">
          <div className="text-5xl mb-3">📭</div>
          <p>Chưa có bài viết nào trong mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="h-full glass rounded-2xl p-5 border border-white/50 hover:border-purple-mid/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                {/* Top: emoji + tags */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl shrink-0 leading-none">{post.cover_emoji}</span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-body font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-deep/8 text-purple-deep/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-purple-deep text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-purple-mid transition-colors">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="font-body text-purple-deep/55 text-sm leading-relaxed line-clamp-3 mb-4">
                  {post.description}
                </p>

                {/* Bottom: date + read time + CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-body text-purple-deep/35 leading-tight">
                    <div>{formatDate(post.published_at ?? post.created_at)}</div>
                    <div>{post.reading_time} phút đọc</div>
                  </div>
                  <span className="text-xs font-body font-bold text-purple-mid group-hover:translate-x-0.5 transition-transform">
                    Đọc →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
