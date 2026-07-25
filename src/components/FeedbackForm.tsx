"use client";

import { useState } from "react";

interface Props {
  /** Buyurtma id — link `?ref=` orqali keladi, fikrni buyurtmaga bog'laydi. */
  refId?: string;
  /** Oldindan to'ldiriladigan ism (buyurtmadan). */
  defaultName?: string;
}

export default function FeedbackForm({ refId, defaultName }: Props) {
  const [form, setForm] = useState({
    name: defaultName ?? "",
    phone: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError("Iltimos, fikringizni yozing");
      return;
    }
    setError("");
    setSaving(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ref: refId }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-3">💛</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Rahmat!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fikringiz yuborildi. E&apos;tiboringiz uchun tashakkur!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Ismingiz
        </label>
        <input
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Ixtiyoriy"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Telefon raqamingiz
        </label>
        <input
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Ixtiyoriy — javob berishimiz uchun"
          inputMode="tel"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Murojaat, fikr va taklifingiz *
        </label>
        <textarea
          rows={5}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Xizmatimiz haqidagi fikringiz yoki takliflaringizni yozing..."
          maxLength={2000}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full px-4 py-2.5 bg-[#8B1A1A] text-white text-sm font-medium rounded-lg hover:bg-[#6B0F0F] transition-colors disabled:opacity-50"
      >
        {saving ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}
