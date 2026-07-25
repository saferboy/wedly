import { db } from "@/lib/db";
import FeedbackForm from "@/components/FeedbackForm";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export const metadata: Metadata = {
  title: "Fikr va takliflar — Wedly",
  robots: { index: false, follow: false },
};

/**
 * Ochiq fikr-taklif sahifasi. Taklifnoma linki bilan birga botdan yuboriladi
 * (`/fikr?ref=<orderId>`). Buyurtma bo'lsa ism oldindan to'ldiriladi.
 */
export default async function FeedbackPage({ searchParams }: Props) {
  const { ref: refId } = await searchParams;

  // Buyurtma nomini (bo'lsa) oldindan to'ldirish uchun best-effort olamiz.
  let defaultName: string | undefined;
  if (refId) {
    try {
      const order = await db.order.findUnique({
        where: { id: refId },
        select: { brideName: true, groomName: true },
      });
      if (order) {
        defaultName = order.groomName
          ? `${order.groomName} & ${order.brideName}`
          : order.brideName;
      }
    } catch {
      /* DB muammosi bo'lsa ham forma ochilaveradi */
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="font-serif italic text-2xl text-[#8B1A1A]">Wedly</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
            Fikr va takliflaringiz
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Murojaat, fikr va takliflaringizni yozib qoldiring — xizmatimizni
            yaxshilashga yordam beradi. 💛
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <FeedbackForm refId={refId} defaultName={defaultName} />
        </div>
      </div>
    </div>
  );
}
