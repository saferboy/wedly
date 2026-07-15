"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import type { TemplateConfig } from "@/lib/templates";

interface Order {
  id: string;
  eventType: string;
  groomName?: string | null;
  brideName: string;
  eventDate?: Date | null;
  eventTime?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  yandexLink?: string | null;
  googleLink?: string | null;
  cardNumber?: string | null;
  cardHolder?: string | null;
  templateId?: string | null;
}

interface MusicTrack {
  id: string;
  title: string;
  artist?: string | null;
}

interface Props {
  order?: Order | null;
  templates: TemplateConfig[];
  musicTracks: MusicTrack[];
}

export default function CreateInvitationForm({ order, templates, musicTracks }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    eventType: order?.eventType ?? "WEDDING",
    groomName: order?.groomName ?? "",
    brideName: order?.brideName ?? "",
    eventDate: order?.eventDate
      ? new Date(order.eventDate).toISOString().split("T")[0]
      : "",
    eventTime: order?.eventTime ?? "14:00",
    venueName: order?.venueName ?? "",
    venueAddress: order?.venueAddress ?? "",
    yandexMapUrl: order?.yandexLink ?? "",
    googleMapUrl: order?.googleLink ?? "",
    letterText: "",
    letterTextRu: "",
    cardNumber: order?.cardNumber ?? "",
    cardHolder: order?.cardHolder ?? "",
    templateSlug: order?.templateId ?? templates[0]?.slug ?? "",
    musicTrackId: "",
    slug: order
      ? slugify(`${order.groomName ?? ""}-${order.brideName}`)
      : "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orderId: order?.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Xatolik yuz berdi");
      }

      const data = await res.json();
      router.push(`/admin/invitations`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xatolik");
      setSaving(false);
    }
  };

  const filteredTemplates = templates.filter(
    (t) => t.eventType === form.eventType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Asosiy */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Asosiy ma'lumotlar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Tadbir turi</label>
            <select className="input" value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
              <option value="WEDDING">💍 To'y</option>
              <option value="BACHELORETTE">🌸 Qiz bazmi</option>
              <option value="BIRTHDAY">🎈 Tug'ilgan kun</option>
            </select>
          </div>
          <div>
            <label className="label">URL slug</label>
            <input className="input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="jasur-nilufar" required />
          </div>
        </div>

        {form.eventType === "WEDDING" && (
          <div>
            <label className="label">Kuyov ismi</label>
            <input className="input" value={form.groomName} onChange={(e) => set("groomName", e.target.value)} placeholder="Jasur Toshmatov" />
          </div>
        )}

        <div>
          <label className="label">Kelin ismi *</label>
          <input className="input" value={form.brideName} onChange={(e) => set("brideName", e.target.value)} placeholder="Nilufar Karimova" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Sana *</label>
            <input className="input" type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} required />
          </div>
          <div>
            <label className="label">Soat *</label>
            <input className="input" value={form.eventTime} onChange={(e) => set("eventTime", e.target.value)} placeholder="14:00" required />
          </div>
        </div>
      </div>

      {/* To'yxona */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">To'yxona</h2>
        <div>
          <label className="label">Nomi *</label>
          <input className="input" value={form.venueName} onChange={(e) => set("venueName", e.target.value)} placeholder="Oq Saroy Restaurant" required />
        </div>
        <div>
          <label className="label">Manzil *</label>
          <input className="input" value={form.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} placeholder="S. Ayniy ko'chasi, 60, Toshkent" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Yandex Maps URL</label>
            <input className="input" value={form.yandexMapUrl} onChange={(e) => set("yandexMapUrl", e.target.value)} placeholder="https://yandex.uz/maps/..." />
          </div>
          <div>
            <label className="label">Google Maps URL</label>
            <input className="input" value={form.googleMapUrl} onChange={(e) => set("googleMapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </div>

      {/* Xat matni */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Taklif xati</h2>
        <div>
          <label className="label">O'zbek tilida</label>
          <textarea className="input h-28 resize-none" value={form.letterText} onChange={(e) => set("letterText", e.target.value)} placeholder="Aziz va qadrdon yaqinim! ..." />
        </div>
        <div>
          <label className="label">Rus tilida</label>
          <textarea className="input h-28 resize-none" value={form.letterTextRu} onChange={(e) => set("letterTextRu", e.target.value)} placeholder="Дорогой и близкий мне человек! ..." />
        </div>
      </div>

      {/* To'yona karta */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">To'yona karta (ixtiyoriy)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Karta raqami</label>
            <input className="input" value={form.cardNumber} onChange={(e) => set("cardNumber", e.target.value)} placeholder="8600 0000 0000 0000" />
          </div>
          <div>
            <label className="label">Karta egasi</label>
            <input className="input" value={form.cardHolder} onChange={(e) => set("cardHolder", e.target.value)} placeholder="JASUR TOSHMATOV" />
          </div>
        </div>
      </div>

      {/* Template va musiqa */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Template va musiqa</h2>
        <div>
          <label className="label">Template *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredTemplates.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => set("templateSlug", t.slug)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.templateSlug === t.slug
                    ? "border-[#8B1A1A] bg-red-50 dark:bg-red-950/30"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300"
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{ backgroundColor: t.previewBg }}
                />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {musicTracks.length > 0 && (
          <div>
            <label className="label">Fon musiqasi</label>
            <select className="input" value={form.musicTrackId} onChange={(e) => set("musicTrackId", e.target.value)}>
              <option value="">— Musiqa yo'q —</option>
              {musicTracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}{t.artist ? ` — ${t.artist}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/40 dark:text-red-400 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-[#8B1A1A] text-white font-semibold rounded-xl hover:bg-[#6B0F0F] transition-colors disabled:opacity-50"
      >
        {saving ? "Saqlanmoqda..." : "Taklif yaratish va aktivlashtirish"}
      </button>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; font-weight: 500; color: #6b7280; margin-bottom: 0.375rem; }
        .input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.875rem; outline: none; background: #fff; color: #111827; }
        .input:focus { border-color: #8B1A1A; box-shadow: 0 0 0 3px rgba(139,26,26,0.1); }
        :global(.dark) .label { color: #9ca3af; }
        :global(.dark) .input { background: #111827; border-color: #374151; color: #ffffff; }
        :global(.dark) .input::placeholder { color: #6b7280; }
      `}</style>
    </form>
  );
}
