"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  coins: number;
  coins_spent: number;
  readings_count: number;
  last_active: string | null;
  created_at: string;
}

interface Summary {
  total_readings: number;
  active_users_7d: number;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  cover_emoji: string;
  reading_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse { users: User[]; total: number; page: number; limit: number; summary?: Summary; }

const EMOJI_OPTIONS = ["🔮","🃏","💕","💼","💰","🌙","✨","🌸","🧿","⭐","🌟","💜"];

// ── Slug helper ───────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g,"").replace(/đ/g,"d")
    .replace(/[^a-z0-9\s-]/g,"").trim()
    .replace(/\s+/g,"-").replace(/-+/g,"-");
}

// ── Empty post ────────────────────────────────────────────────────────────────
function emptyPost(): Partial<BlogPost> {
  return {
    title:"", slug:"", description:"", content:"",
    tags:[], cover_emoji:"🔮", reading_time:5, published:false,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const { data: session, status } = useSession();

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<"users"|"blog">("users");

  // ── Users state ────────────────────────────────────────────────────────────
  const [users, setUsers]       = useState<User[]>([]);
  const [total, setTotal]       = useState(0);
  const [summary, setSummary]   = useState<Summary>({ total_readings: 0, active_users_7d: 0 });
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [editUser, setEditUser] = useState<User|null>(null);
  const [editCoins, setEditCoins] = useState("");
  const [editMode, setEditMode] = useState<"set"|"add"|"subtract">("add");
  const [saving, setSaving]     = useState(false);

  // ── Blog state ─────────────────────────────────────────────────────────────
  const [posts, setPosts]           = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPost, setEditPost]     = useState<Partial<BlogPost>>(emptyPost());
  const [isNew, setIsNew]           = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [tagInput, setTagInput]     = useState("");
  const [preview, setPreview]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const showToast = (msg:string, ok:boolean) => {
    setToast({msg,ok});
    setTimeout(()=>setToast(null),3000);
  };

  // ── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({page:String(page)});
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin?${params}`);
      if (res.status === 403) { setForbidden(true); return; }
      const data: ApiResponse = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      if (data.summary) setSummary(data.summary);
    } finally { setLoadingUsers(false); }
  }, [page, search]);

  useEffect(() => { if (status === "authenticated") fetchUsers(); }, [status, fetchUsers]);

  // ── Fetch blog posts ───────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    if (forbidden) return;
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.status === 403) { setForbidden(true); return; }
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally { setLoadingPosts(false); }
  }, [forbidden]);

  useEffect(() => { if (status === "authenticated" && tab === "blog") fetchPosts(); }, [status, tab, fetchPosts]);

  // ── User actions ───────────────────────────────────────────────────────────
  const handleSaveUser = async () => {
    if (!editUser || !editCoins) return;
    const amount = parseInt(editCoins);
    if (isNaN(amount) || amount < 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId:editUser.id, action:editMode, amount}),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id===editUser.id ? {...u,coins:data.coins} : u));
        showToast(`✓ Đã cập nhật xu cho ${editUser.name??editUser.email}`, true);
        setEditUser(null);
      } else { showToast(data.error??"Lỗi rồi!", false); }
    } finally { setSaving(false); }
  };

  // ── Blog actions ───────────────────────────────────────────────────────────
  const openNewPost = () => {
    setEditPost(emptyPost()); setIsNew(true); setTagInput(""); setPreview(false); setEditorOpen(true);
  };
  const openEditPost = (p: BlogPost) => {
    setEditPost({...p}); setIsNew(false); setTagInput(""); setPreview(false); setEditorOpen(true);
  };

  const handleSavePost = async () => {
    if (!editPost.title?.trim()) { showToast("Cần có tiêu đề!", false); return; }
    setSavingPost(true);
    try {
      const url  = isNew ? "/api/admin/blog" : `/api/admin/blog/${editPost.id}`;
      const meth = isNew ? "POST" : "PUT";
      const res  = await fetch(url, {
        method:meth, headers:{"Content-Type":"application/json"}, body:JSON.stringify(editPost),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error??"Lỗi lưu bài!", false); return; }
      showToast(isNew ? "✓ Đã tạo bài viết!" : "✓ Đã lưu!", true);
      setEditorOpen(false);
      fetchPosts();
    } finally { setSavingPost(false); }
  };

  const handleTogglePublish = async (p: BlogPost) => {
    const res = await fetch(`/api/admin/blog/${p.id}`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({published:!p.published}),
    });
    if (res.ok) {
      showToast(p.published ? "Đã ẩn bài" : "✓ Đã xuất bản!", true);
      fetchPosts();
    }
  };

  const handleDeletePost = async (id: string) => {
    const res = await fetch(`/api/admin/blog/${id}`, {method:"DELETE"});
    if (res.ok) { showToast("Đã xóa bài viết", true); fetchPosts(); }
    setDeleteConfirm(null);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !editPost.tags?.includes(t)) {
      setEditPost(p => ({...p, tags:[...(p.tags??[]),t]}));
    }
    setTagInput("");
  };
  const removeTag = (t:string) => setEditPost(p => ({...p, tags:p.tags?.filter(x=>x!==t)??[]}));

  const totalPages = Math.ceil(total/20);

  // ── Auth guards ────────────────────────────────────────────────────────────
  if (status==="loading") return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-400">Đang tải...</p></div>;
  if (status==="unauthenticated") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Bạn cần đăng nhập</p>
        <button onClick={()=>signIn("google")} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">Đăng nhập</button>
      </div>
    </div>
  );
  if (forbidden) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Không có quyền</h1>
        <p className="text-gray-500">{session?.user?.email}</p>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-none">Tarot Bestie Admin</h1>
            <p className="text-gray-400 text-xs mt-0.5">{session?.user?.email}</p>
          </div>
        </div>
        <a href="/" className="text-sm text-purple-600 hover:underline">← Về app</a>
      </div>

      {/* Tab switcher */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="max-w-5xl mx-auto flex gap-1">
          {(["users","blog"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab===t ? "border-purple-600 text-purple-700" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t==="users" ? "👥 Users" : "📝 Blog"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ══ USERS TAB ══════════════════════════════════════════════════════ */}
        {tab==="users" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">Tổng users</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{total}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">Active 7 ngày</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{summary.active_users_7d}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">Tổng readings</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{summary.total_readings.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm">Xu đang giữ</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{users.reduce((s,u)=>s+u.coins,0).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
                <p className="text-gray-400 text-sm">Xu đã tiêu (trang)</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{users.reduce((s,u)=>s+(u.coins_spent??0),0).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){setSearch(searchInput);setPage(1);}}}
                placeholder="Tìm theo email hoặc tên..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 transition bg-white shadow-sm"
              />
              <button onClick={()=>{setSearch(searchInput);setPage(1);}} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">Tìm</button>
              {search && <button onClick={()=>{setSearch("");setSearchInput("");setPage(1);}} className="px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition">Xoá</button>}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Người dùng</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-semibold hidden md:table-cell">Email</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold">Xu 🪙</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold hidden sm:table-cell">Đã tiêu 🔥</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold hidden sm:table-cell">Readings 🃏</th>
                      <th className="text-left px-4 py-3.5 text-gray-500 font-semibold hidden lg:table-cell">Hoạt động cuối</th>
                      <th className="text-left px-4 py-3.5 text-gray-500 font-semibold hidden lg:table-cell">Tham gia</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td colSpan={5} className="text-center py-16 text-gray-400">Đang tải...</td></tr>
                    ) : users.length===0 ? (
                      <tr><td colSpan={5} className="text-center py-16 text-gray-400">Không tìm thấy user nào</td></tr>
                    ) : users.map(user => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {user.avatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover"/>
                              : <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">{(user.name??user.email)?.[0]?.toUpperCase()}</div>}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-700 truncate max-w-[120px]">{user.name??"—"}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[120px] md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-sm hidden md:table-cell">{user.email}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${user.coins===0?"bg-gray-100 text-gray-400":user.coins>=100?"bg-purple-100 text-purple-700":"bg-amber-50 text-amber-700"}`}>
                            🪙 {user.coins}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${(user.coins_spent??0)===0?"bg-gray-100 text-gray-400":"bg-orange-50 text-orange-600"}`}>
                            🔥 {user.coins_spent??0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${user.readings_count===0?"bg-gray-100 text-gray-400":"bg-blue-50 text-blue-600"}`}>
                            🃏 {user.readings_count}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-sm hidden lg:table-cell">
                          {user.last_active
                            ? new Date(user.last_active).toLocaleDateString("vi-VN")
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-sm hidden lg:table-cell">
                          {new Date(user.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button onClick={()=>{setEditUser(user);setEditCoins("");setEditMode("add");}} className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-semibold transition">Sửa xu</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages>1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-400">{total} users · trang {page}/{totalPages}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">← Trước</button>
                    <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Sau →</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ BLOG TAB ═══════════════════════════════════════════════════════ */}
        {tab==="blog" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Quản lý Blog</h2>
                <p className="text-sm text-gray-400 mt-0.5">{posts.length} bài viết · {posts.filter(p=>p.published).length} đã xuất bản</p>
              </div>
              <button onClick={openNewPost}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition shadow-sm">
                + Tạo bài mới
              </button>
            </div>

            {loadingPosts ? (
              <div className="text-center py-24 text-gray-400">Đang tải...</div>
            ) : posts.length===0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400 mb-4">Chưa có bài viết nào</p>
                <button onClick={openNewPost} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">Tạo bài đầu tiên</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Bài viết</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold">Trạng thái</th>
                      <th className="text-left px-4 py-3.5 text-gray-500 font-semibold hidden sm:table-cell">Ngày tạo</th>
                      <th className="text-center px-4 py-3.5 text-gray-500 font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl shrink-0">{post.cover_emoji}</span>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate max-w-[260px]">{post.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug} · {post.reading_time} phút</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button onClick={()=>handleTogglePublish(post)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                              post.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}>
                            {post.published ? "✓ Đã xuất bản" : "● Nháp"}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-gray-400 hidden sm:table-cell">
                          {new Date(post.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={()=>openEditPost(post)} className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-semibold transition">Sửa</button>
                            <button onClick={()=>setDeleteConfirm(post.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 hover:bg-red-100 rounded-lg font-semibold transition">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ EDIT USER MODAL ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editUser && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setEditUser(null)} />
            <motion.div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" initial={{scale:0.95,y:10}} animate={{scale:1,y:0}} exit={{scale:0.95,y:10}}>
              <h3 className="font-bold text-gray-800 text-lg mb-1">Chỉnh xu</h3>
              <div className="flex items-center gap-2 mb-5">
                {editUser.avatar
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={editUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover"/>
                  : <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">{(editUser.name??editUser.email)?.[0]?.toUpperCase()}</div>}
                <div>
                  <p className="text-sm font-semibold text-gray-700">{editUser.name??editUser.email}</p>
                  <p className="text-xs text-gray-400">Hiện có: <strong className="text-amber-600">{editUser.coins} xu</strong></p>
                </div>
              </div>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-4">
                {(["add","subtract","set"] as const).map(m=>(
                  <button key={m} onClick={()=>setEditMode(m)} className={`flex-1 py-2 text-sm font-semibold transition ${editMode===m?"bg-purple-600 text-white":"text-gray-500 hover:bg-gray-50"}`}>
                    {m==="add"?"+ Thêm":m==="subtract"?"− Trừ":"= Đặt"}
                  </button>
                ))}
              </div>
              <div className="relative mb-5">
                <input type="number" min="0" value={editCoins} onChange={e=>setEditCoins(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSaveUser()} placeholder="Nhập số xu..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-base outline-none focus:border-purple-400 transition pr-16" autoFocus/>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪙 xu</span>
              </div>
              {editCoins && !isNaN(parseInt(editCoins)) && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-purple-50 text-sm text-purple-700">
                  Kết quả: <strong>{editMode==="set"?Math.max(0,parseInt(editCoins)):editMode==="add"?editUser.coins+parseInt(editCoins):Math.max(0,editUser.coins-parseInt(editCoins))} xu</strong>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={()=>setEditUser(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">Huỷ</button>
                <button onClick={handleSaveUser} disabled={saving||!editCoins} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition">{saving?"Đang lưu...":"Lưu"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ BLOG EDITOR MODAL ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-stretch" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="absolute inset-0 bg-black/50" onClick={()=>setEditorOpen(false)} />
            <motion.div
              className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
              initial={{x:80,opacity:0}} animate={{x:0,opacity:1}} exit={{x:80,opacity:0}}
              transition={{type:"spring",stiffness:300,damping:30}}
            >
              {/* Editor header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-bold text-gray-800">{isNew?"Tạo bài mới":"Chỉnh sửa bài"}</h2>
                <div className="flex gap-2">
                  <button onClick={()=>setPreview(v=>!v)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${preview?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {preview?"✏️ Soạn":"👁 Xem trước"}
                  </button>
                  <button onClick={handleSavePost} disabled={savingPost}
                    className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 disabled:opacity-60 transition">
                    {savingPost?"Đang lưu...":"💾 Lưu"}
                  </button>
                  <button onClick={()=>setEditorOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl px-1">×</button>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-5 flex-1">

                {preview ? (
                  /* ── Preview ── */
                  <div>
                    <div className="w-full py-10 px-6 text-white text-center rounded-2xl mb-6"
                      style={{background:"linear-gradient(135deg,#7B4FA6,#E8739A)"}}>
                      <div className="text-6xl mb-3">{editPost.cover_emoji}</div>
                      <h1 className="text-2xl font-bold">{editPost.title||"Tiêu đề..."}</h1>
                      <p className="text-white/70 text-sm mt-2">{editPost.description}</p>
                    </div>
                    <div
                      className="font-body text-gray-800 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1"
                      dangerouslySetInnerHTML={{__html:editPost.content||"<p>Chưa có nội dung...</p>"}}
                    />
                  </div>
                ) : (
                  /* ── Form ── */
                  <>
                    {/* Cover emoji */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Cover Emoji</label>
                      <div className="flex gap-2 flex-wrap">
                        {EMOJI_OPTIONS.map(e=>(
                          <button key={e} onClick={()=>setEditPost(p=>({...p,cover_emoji:e}))}
                            className={`text-2xl p-2 rounded-xl border-2 transition ${editPost.cover_emoji===e?"border-purple-500 bg-purple-50":"border-gray-100 hover:border-purple-200"}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tiêu đề *</label>
                      <input type="text" value={editPost.title??""} placeholder="Tiêu đề bài viết..."
                        onChange={e=>{
                          const title=e.target.value;
                          setEditPost(p=>({...p, title, slug: isNew ? slugify(title) : p.slug}));
                        }}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base font-semibold outline-none focus:border-purple-400 transition"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Slug (URL)</label>
                      <input type="text" value={editPost.slug??""} placeholder="url-cua-bai-viet"
                        onChange={e=>setEditPost(p=>({...p,slug:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 text-sm font-mono outline-none focus:border-purple-400 transition"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Mô tả ngắn (SEO)</label>
                      <textarea rows={2} value={editPost.description??""} placeholder="Mô tả ngắn hiện trên Google và danh sách bài..."
                        onChange={e=>setEditPost(p=>({...p,description:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm outline-none focus:border-purple-400 transition resize-none"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editPost.tags?.map(t=>(
                          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            {t}
                            <button onClick={()=>removeTag(t)} className="text-purple-400 hover:text-purple-700 ml-0.5">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={tagInput} placeholder="Nhập tag rồi Enter..."
                          onChange={e=>setTagInput(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addTag();}}}
                          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 transition"
                        />
                        <button onClick={addTag} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-200 transition">+</button>
                      </div>
                    </div>

                    {/* Reading time */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Thời gian đọc (phút)</label>
                      <input type="number" min="1" max="60" value={editPost.reading_time??5}
                        onChange={e=>setEditPost(p=>({...p,reading_time:parseInt(e.target.value)||5}))}
                        className="w-24 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm outline-none focus:border-purple-400 transition"
                      />
                    </div>

                    {/* Published toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Xuất bản</p>
                        <p className="text-xs text-gray-400 mt-0.5">{editPost.published?"Hiển thị trên blog":"Đang là bản nháp"}</p>
                      </div>
                      <button onClick={()=>setEditPost(p=>({...p,published:!p.published}))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${editPost.published?"bg-purple-600":"bg-gray-200"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editPost.published?"translate-x-6":""}`}/>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Nội dung (HTML)</label>
                      <textarea
                        value={editPost.content??""}
                        onChange={e=>setEditPost(p=>({...p,content:e.target.value}))}
                        placeholder={`<h2>Phần 1</h2>\n<p>Nội dung...</p>\n<h2>Phần 2</h2>\n<p>Tiếp tục...</p>`}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm font-mono outline-none focus:border-purple-400 transition resize-y"
                        style={{minHeight:"320px"}}
                      />
                      <p className="text-xs text-gray-400 mt-1.5">Dùng thẻ HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DELETE CONFIRM ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="absolute inset-0 bg-black/40" onClick={()=>setDeleteConfirm(null)}/>
            <motion.div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}>
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Xóa bài viết?</h3>
              <p className="text-gray-500 text-sm mb-5">Hành động này không thể hoàn tác.</p>
              <div className="flex gap-3">
                <button onClick={()=>setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-50">Huỷ</button>
                <button onClick={()=>handleDeletePost(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition">Xóa</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOAST ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold whitespace-nowrap ${toast.ok?"bg-green-500":"bg-red-500"}`}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
