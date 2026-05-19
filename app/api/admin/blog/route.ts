import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const HARDCODED_ADMINS = ["duongtruonggiang2812@gmail.com", "truonggiangduong2812@gmail.com"];
const ADMIN_EMAILS = [
  ...HARDCODED_ADMINS,
  ...(process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET /api/admin/blog — list ALL posts (including drafts)
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const { data, error } = await admin
    .from("blog_posts")
    .select("id, slug, title, description, tags, cover_emoji, reading_time, published, published_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data ?? [] });
}

// POST /api/admin/blog — create new post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const body = await req.json();
  const { title, slug: rawSlug, description, content, tags, cover_emoji, reading_time, published } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const slug = rawSlug?.trim() || slugify(title);

  const payload = {
    slug,
    title: title.trim(),
    description: description?.trim() ?? "",
    content: content ?? "",
    tags: Array.isArray(tags) ? tags : [],
    cover_emoji: cover_emoji ?? "🔮",
    reading_time: parseInt(reading_time ?? "5") || 5,
    published: Boolean(published),
    published_at: published ? new Date().toISOString() : null,
  };

  const { data, error } = await admin
    .from("blog_posts")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data }, { status: 201 });
}
