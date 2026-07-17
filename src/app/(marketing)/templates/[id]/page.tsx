import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";
import InvitationWrapper from "@/components/invitation/InvitationWrapper";
import type { InvitationData } from "@/types/invitation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const template = getTemplate(id);
  if (!template) return { title: "Template topilmadi" };
  return { title: `${template.name} — Wedly Template Preview` };
}

// Demo ma'lumotlar — preview uchun
function getDemoData(templateSlug: string): InvitationData {
  const template = getTemplate(templateSlug)!;
  const isWedding = template.eventType === "WEDDING";

  return {
    id: "demo",
    slug: "demo",
    eventType: template.eventType,
    groomName: isWedding ? "Jasur" : undefined,
    brideName: isWedding ? "Nilufar" : "Malika",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    eventTime: "14:00",
    venueName: "OQ SAROY RESTAURANT",
    venueAddress: "S. Ayniy ko'chasi, 60, Olimkent shaharchasi",
    yandexMapUrl: "#",
    googleMapUrl: "#",
    letterText: "",
    letterTextRu: "",
    photoUrl: null,
    musicTrack: null,
    customMusicUrl: null,
    cardNumber: isWedding ? "8600 1234 5678 9012" : null,
    cardHolder: isWedding ? "JASUR TOSHMATOV" : null,
    template: { slug: templateSlug, name: template.name },
  };
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;
  const template = getTemplate(id);
  if (!template) notFound();

  const demoData = getDemoData(id);

  return (
    <div className="relative">
      {/* Preview banner — fixed, single-row, responsive */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-black/80 backdrop-blur-sm text-white flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 text-[10px] sm:text-xs bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 rounded font-bold">
            PREVIEW
          </span>
          <span className="text-xs sm:text-sm font-medium truncate">{template.name}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/templates"
            className="text-xs text-gray-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline"> Orqaga</span>
          </Link>
          <a
            href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=template_${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{
              background: template.theme.accentColor,
              color: template.previewBg,
            }}
          >
            Buyurtma <span className="hidden sm:inline">berish</span>
          </a>
        </div>
      </div>

      {/* Actual invitation preview — offset the template's fixed toggles below the banner */}
      <div
        className="pt-12"
        style={{ ["--tpl-chrome-top"]: "48px" } as CSSProperties}
      >
        <InvitationWrapper data={demoData} />
      </div>
    </div>
  );
}
