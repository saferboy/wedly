import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { buildPreviewData } from "@/lib/invitation/preview";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";
import InvitationWrapper from "@/components/invitation/InvitationWrapper";
import type { CSSProperties } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Taklifnoma preview — Wedly",
  robots: { index: false, follow: false },
};

/**
 * To'lovdan oldingi preview: mijoz o'z ma'lumoti (rasm/musiqa bilan) qanday
 * taklifnoma chiqishini ko'radi. Draft `Order` dan render qilinadi — hali
 * `Invitation` yaratilmaydi.
 */
export default async function OrderPreviewPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { template: true },
  });

  if (!order) notFound();

  const data = await buildPreviewData(order);
  if (!data) notFound();

  return (
    <div className="relative">
      {/* Preview banner — fixed, single-row, responsive */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-black/80 backdrop-blur-sm text-white flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 text-[10px] sm:text-xs bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 rounded font-bold">
KO&apos;RISH
          </span>
          <span className="text-xs sm:text-sm font-medium truncate">
            {"To'lovdan oldingi ko'rinish"}
          </span>
        </div>
        <a
          href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-gray-300 hover:text-white transition-colors whitespace-nowrap"
        >
          Botga qaytish <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Actual invitation preview — offset the template's fixed toggles below the banner */}
      <div
        className="pt-12"
        style={{ ["--tpl-chrome-top"]: "48px" } as CSSProperties}
      >
        <InvitationWrapper data={data} />
      </div>
    </div>
  );
}
