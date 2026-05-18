"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  coins: number;
  created_at: string;
}

interface ApiResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editCoins, setEditCoins] = useState("");
  const [editMode, setEditMode] = useState<"set" | "add" | "subtract">("set");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin?${params}`);
      if (res.status === 403) { setForbidden(true); return; }
      const data: ApiResponse = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (status === "authenticated") fetchUsers();
  }, [status, fetchUsers]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!editUser || !editCoins) return;
    const amount = parseInt(editCoins);
    if (isNaN(amount) || amount < 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editUser.id, action: editMode, amount }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, coins: data.coins } : u));
        showToast(`✓ Đã cập nhật xu cho ${editUser.name ?? editUser.email}`, true);
        setEditUser(null);
      } else {
        showToast(data.error ?? "Lỗi rồi!", false);
      }
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(total / 20);

  // Not logged in
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Bạn cần đăng nhập để truy cập trang admin</p>
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-500">Tài khoản <strong>{session?.user?.email}</strong> không phải admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Tổng users</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Tổng xu (trang này)</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {users.reduce((s, u) => s + u.coins, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
            <p className="text-gray-400 text-sm">Đang xem</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              Trang {page}/{totalPages || 1}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            placeholder="Tìm theo email hoặc tên..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-400 transition bg-white shadow-sm"
          />
          <button
            onClick={() => { setSearch(searchInput); setPage(1); }}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            Tìm
          </button>
          {search && (
            <button
              onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Xoá
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Người dùng</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Email</th>
                  <th className="text-center px-5 py-3.5 text-gray-500 font-semibold">Xu 🪙</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-semibold">Ngày tham gia</th>
                  <th className="text-center px-5 py-3.5 text-gray-500 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      Đang tải...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      Không tìm thấy user nào
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                              {(user.name ?? user.email)?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-700">{user.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                          user.coins === 0 ? "bg-gray-100 text-gray-400" :
                          user.coins >= 100 ? "bg-purple-100 text-purple-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          🪙 {user.coins}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => { setEditUser(user); setEditCoins(""); setEditMode("add"); }}
                          className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-semibold transition"
                        >
                          Sửa xu
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                {total} users · trang {page}/{totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  ← Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditUser(null)} />
            <motion.div
              className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-1">Chỉnh xu</h3>
              <div className="flex items-center gap-2 mb-5">
                {editUser.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {(editUser.name ?? editUser.email)?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-700">{editUser.name ?? editUser.email}</p>
                  <p className="text-xs text-gray-400">Hiện có: <strong className="text-amber-600">{editUser.coins} xu</strong></p>
                </div>
              </div>

              {/* Mode tabs */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-4">
                {(["add", "subtract", "set"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEditMode(m)}
                    className={`flex-1 py-2 text-sm font-semibold transition ${
                      editMode === m
                        ? "bg-purple-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {m === "add" ? "+ Thêm" : m === "subtract" ? "− Trừ" : "= Đặt"}
                  </button>
                ))}
              </div>

              <div className="relative mb-5">
                <input
                  type="number"
                  min="0"
                  value={editCoins}
                  onChange={(e) => setEditCoins(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="Nhập số xu..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-base outline-none focus:border-purple-400 transition pr-16"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🪙 xu</span>
              </div>

              {/* Preview */}
              {editCoins && !isNaN(parseInt(editCoins)) && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-purple-50 text-sm text-purple-700">
                  Kết quả:{" "}
                  <strong>
                    {editMode === "set"
                      ? Math.max(0, parseInt(editCoins))
                      : editMode === "add"
                      ? editUser.coins + parseInt(editCoins)
                      : Math.max(0, editUser.coins - parseInt(editCoins))} xu
                  </strong>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editCoins}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold whitespace-nowrap ${
              toast.ok ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
