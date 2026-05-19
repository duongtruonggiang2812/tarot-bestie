import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/blog?tag=xxx&limit=20
export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const url = new URL(req.url);
  const tag = url.searchParams.get("tag")?.trim() ?? "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);

  let query = admin
    .from("blog_posts")
    .select("id, slug, title, description, tags, cover_emoji, reading_time, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data ?? [] }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
