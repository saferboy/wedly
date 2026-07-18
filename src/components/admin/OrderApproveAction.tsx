"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
  hasTelegram: boolean;
  hasPaymentScreenshot: boolean;
  invitation: { slug: string } | null;
  pdfHref: string | null;
}

export default function OrderApproveAction({
  orderId,
  hasTelegram,
  hasPaymentScreenshot,
  invitation,
  pdfHref,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ sent: boolean } | null>(null);

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xatolik yuz berdi");
      setResult({ sent: data.sent });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  // ── Taklifnoma allaqachon tayyor ─────────────────────────────
  if (invitation) {
    return (
      <div className="space-y-3 rounded-xl border border-green-100 bg-green-50 p-6 dark:border-green-900/40 dark:bg-green-900/20">
        <h2 className="mb-1 font-semibold text-green-800 dark:text-green-300">
          Taklif tayyor ✓
        </h2>
        <Link
          href={`/i/${invitation.slug}`}
          target="_blank"
          className="block break-all text-sm text-green-700 underline dark:text-green-400"
        >
          /i/{invitation.slug}
        </Link>

        {result && (
          <p className="text-xs text-green-700 dark:text-green-400">
            {result.sent ? "✓ Havola mijozga yuborildi" : "⚠ Havola yuborilmadi (Telegram)"}
          </p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={run}
          disabled={loading || !hasTelegram}
          className="block w-full rounded-lg border border-green-200 bg-white py-2.5 text-center text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 disabled:opacity-50 dark:border-green-900/40 dark:bg-gray-900 dark:text-green-300 dark:hover:bg-green-900/30"
        >
          {loading ? "Yuborilmoqda..." : "Havolani qayta yuborish"}
        </button>

        {pdfHref && (
          <a
            href={pdfHref}
            download
            className="block w-full rounded-lg border border-green-200 bg-white py-2.5 text-center text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 dark:border-green-900/40 dark:bg-gray-900 dark:text-green-300 dark:hover:bg-green-900/30"
          >
            PDF yuklab olish
          </a>
        )}
      </div>
    );
  }

  // ── Hali tayyorlanmagan — avtomatik generatsiya + link ────────
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="font-semibold text-gray-900 dark:text-white">To&apos;lovni tasdiqlash</h2>
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        To&apos;lov chekini tekshiring. Tasdiqlaganingizdan so&apos;ng taklifnoma
        buyurtma ma&apos;lumotlaridan avtomatik yaratiladi va havola mijozga
        yuboriladi.
      </p>

      {!hasPaymentScreenshot && (
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          ⚠ To&apos;lov cheki topilmadi — baribir tasdiqlashingiz mumkin.
        </p>
      )}
      {!hasTelegram && (
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          ⚠ Mijozning Telegram chat ID&apos;si yo&apos;q — havola avtomatik
          yuborilmaydi.
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={run}
        disabled={loading}
        className="block w-full rounded-xl bg-[#8B1A1A] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#6B0F0F] disabled:opacity-50"
      >
        {loading ? "Yaratilmoqda..." : "To'lovni tasdiqlash va link yuborish"}
      </button>

      <Link
        href={`/admin/create?orderId=${orderId}`}
        className="block text-center text-xs text-gray-400 underline hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        Yoki qo&apos;lda to&apos;ldirish
      </Link>
    </div>
  );
}
