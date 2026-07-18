import Link from "next/link";
import type { TemplateConfig } from "@/lib/templates";
import { eventTypeLabel } from "@/lib/eventType";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

interface Props {
  template: TemplateConfig;
}

export default function TemplateCard({ template }: Props) {
  const accent = template.theme.accentColor;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl dark:border-white/5 dark:bg-night-soft">
      {/* Preview */}
      <div
        className="relative flex h-56 flex-col items-center justify-center gap-2 overflow-hidden sm:h-64"
        style={{ backgroundColor: template.previewBg }}
      >
        {/* Chuqurlik uchun gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/35" />

        {/* Ichki oltin ramka */}
        <div
          className="pointer-events-none absolute inset-4 rounded-xl border transition-all duration-300 group-hover:inset-3"
          style={{ borderColor: `${accent}55` }}
        />

        {/* Monogramma tadbir turiga qarab:
            to'y — uzuklar, qiz bazmi — gul, tug'ilgan kun — yulduzcha */}
        {template.eventType === "BIRTHDAY" ? (
          <svg
            width="44"
            height="34"
            viewBox="0 0 44 34"
            fill="none"
            className="relative opacity-95 transition-transform duration-300 group-hover:scale-110"
          >
            {/* Markaziy 4 nurli yulduzcha */}
            <path d="M22 4 L24.5 14.5 L35 17 L24.5 19.5 L22 30 L19.5 19.5 L9 17 L19.5 14.5 Z" fill={accent} />
            {/* Kichik yulduzchalar */}
            <path d="M8 6 L9 9 L12 10 L9 11 L8 14 L7 11 L4 10 L7 9 Z" fill={accent} opacity="0.7" />
            <path d="M37 20 L37.8 22.4 L40 23 L37.8 23.6 L37 26 L36.2 23.6 L34 23 L36.2 22.4 Z" fill={accent} opacity="0.7" />
          </svg>
        ) : template.eventType === "BACHELORETTE" ? (
          <svg
            width="44"
            height="34"
            viewBox="0 0 44 34"
            fill="none"
            className="relative opacity-95 transition-transform duration-300 group-hover:scale-110"
          >
            {/* 5 bargli gul */}
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="22"
                cy="9"
                rx="3.2"
                ry="6"
                stroke={accent}
                strokeWidth="1.2"
                transform={`rotate(${deg} 22 17)`}
              />
            ))}
            <circle cx="22" cy="17" r="2.4" fill={accent} />
          </svg>
        ) : (
          <svg
            width="56"
            height="34"
            viewBox="0 0 56 34"
            fill="none"
            className="relative opacity-95 transition-transform duration-300 group-hover:scale-110"
          >
            <circle cx="22" cy="17" r="12" stroke={accent} strokeWidth="1.5" />
            <circle cx="34" cy="17" r="12" stroke={accent} strokeWidth="1.5" />
            <path d="M28 3 L30 8 L26 8 Z" fill={accent} />
          </svg>
        )}

        {/* Ism preview */}
        <div className="relative text-center">
          <p
            className="font-serif text-lg italic leading-tight"
            style={{ color: "rgba(255,255,255,0.96)" }}
          >
            Ism &amp; Ism
          </p>
          <div className="mx-auto mt-1.5 h-px w-8" style={{ background: accent }} />
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {eventTypeLabel(template.eventType)}
          </p>
        </div>

        {/* Event badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: accent, color: template.previewBg }}
        >
          {template.name}
        </span>
      </div>

      {/* Ma'lumot */}
      <div className="p-5">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-serif text-lg text-[#2C1810] dark:text-white">
            {template.name}
          </h3>
          <div className="mt-1 flex gap-1">
            {[
              template.theme.primaryColor,
              template.theme.accentColor,
              template.theme.bgColor,
            ].map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-gray-200 dark:border-white/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {template.description}
        </p>

        <div className="flex gap-2">
          <Link
            href={`/templates/${template.slug}`}
            className="flex-1 rounded-lg border border-gold/50 py-2 text-center text-sm font-medium text-[#a9782a] transition-colors hover:bg-gold/10 dark:text-gold"
          >
            Preview
          </Link>
          <a
            href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=template_${template.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-gradient-to-b from-[#e6c976] to-[#c9a84c] py-2 text-center text-sm font-semibold text-[#2a2012] transition-all hover:from-[#eed08a] hover:to-[#d4b45a]"
          >
            Buyurtma
          </a>
        </div>
      </div>
    </div>
  );
}
