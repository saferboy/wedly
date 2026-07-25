"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, MessageSquare, Phone } from "lucide-react";

interface FeedbackItem {
  id: string;
  name: string | null;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO
  orderName: string | null;
}

interface Props {
  items: FeedbackItem[];
}

export default function FeedbackManager({ items }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const toggleRead = async (id: string, isRead: boolean) => {
    setBusy(id);
    await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    setBusy(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu fikrni o'chirasizmi?")) return;
    setBusy(id);
    await fetch(`/api/feedback/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm py-16 text-center text-gray-400 dark:text-gray-500">
        <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
        <p>Hozircha fikr yo&apos;q</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li
          key={f.id}
          className={`bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5 transition-colors ${
            f.isRead
              ? "border-gray-100 dark:border-gray-800"
              : "border-[#8B1A1A]/30 dark:border-[#8B1A1A]/40"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-gray-900 dark:text-white">
                  {f.name || "Anonim"}
                </p>
                {!f.isRead && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B1A1A] text-white font-medium">
                    YANGI
                  </span>
                )}
                {f.orderName && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {f.orderName}
                  </span>
                )}
              </div>
              {f.phone && (
                <a
                  href={`tel:${f.phone}`}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5 hover:text-[#8B1A1A]"
                >
                  <Phone size={11} /> {f.phone}
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleRead(f.id, f.isRead)}
                disabled={busy === f.id}
                title={f.isRead ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                  f.isRead
                    ? "text-gray-300 hover:text-gray-500 dark:text-gray-600"
                    : "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/40"
                }`}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                disabled={busy === f.id}
                title="O'chirish"
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap break-words">
            {f.message}
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            {new Date(f.createdAt).toLocaleString("uz-UZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}
