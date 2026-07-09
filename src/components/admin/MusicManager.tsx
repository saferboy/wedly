"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music, Trash2, Plus } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string | null;
  fileUrl: string;
  isActive: boolean;
}

interface Props {
  tracks: Track[];
}

export default function MusicManager({ tracks }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", fileUrl: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/music", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", artist: "", fileUrl: "" });
    setAdding(false);
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu musiqani o'chirasizmi?")) return;
    await fetch(`/api/music/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Musiqa qo'shish */}
      {adding ? (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Yangi musiqa qo'shish</h2>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Musiqa nomi *
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Muhabbat"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Ijrochi
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              value={form.artist}
              onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
              placeholder="Ozodbek Nazarbekov"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Fayl URL (Supabase Storage) *
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              value={form.fileUrl}
              onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
              placeholder="https://xxx.supabase.co/storage/v1/..."
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors disabled:opacity-50"
            >
              {saving ? "Saqlanmoqda..." : "Qo'shish"}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors"
        >
          <Plus size={16} />
          Musiqa qo'shish
        </button>
      )}

      {/* Ro'yxat */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {tracks.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <Music size={32} className="mx-auto mb-3 opacity-30" />
            <p>Kutubxona bo'sh</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {tracks.map((track) => (
              <li key={track.id} className="flex flex-wrap items-center justify-between gap-y-2 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#8B1A1A]/10 rounded-lg flex items-center justify-center">
                    <Music size={16} className="text-[#8B1A1A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{track.title}</p>
                    {track.artist && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{track.artist}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <audio controls src={track.fileUrl} className="h-8 w-36 opacity-70" />
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
