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

// PUT /api/admin/blog/[id] — update post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const body = await req.json();
  const { title, slug, description, content, tags, cover_emoji, reading_time, published } = body;

  // Fetch current post to check published state change
  const { data: current } = await admin
    .from("blog_posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const nowPublishing = published && !current?.published;

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) payload.title = title.trim();
  if (slug !== undefined) payload.slug = slug.trim();
  if (description !== undefined) payload.description = description.trim();
  if (content !== undefined) payload.content = content;
  if (tags !== undefined) payload.tags = Array.isArray(tags) ? tags : [];
  if (cover_emoji !== undefined) payload.cover_emoji = cover_emoji;
  if (reading_time !== undefined) payload.reading_time = parseInt(reading_time) || 5;
  if (published !== undefined) {
    payload.published = Boolean(published);
    if (nowPublishing) {
      payload.published_at = new Date().toISOString();
    } else if (!published) {
      payload.published_at = null;
    }
  }

  const { data, error } = await admin
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data });
}

// DELETE /api/admin/blog/[id] — delete post
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "DB not configured" }, { status: 500 });

  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
