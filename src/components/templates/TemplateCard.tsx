import Link from "next/link";
import type { TemplateConfig } from "@/lib/templates";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

interface Props {
  template: TemplateConfig;
}

export default function TemplateCard({ template }: Props) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      {/* Preview */}
      <div
        className="relative h-64 flex flex-col items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: template.previewBg }}
      >
        {/* Mini konvert preview */}
        <div className="relative w-32 h-20 opacity-80">
          <svg viewBox="0 0 128 80" fill="none" className="w-full h-full">
            <rect width="128" height="80" rx="4" fill="rgba(0,0,0,0.2)" />
            <polygon points="0,0 64,44 128,0" fill="rgba(255,255,255,0.15)" />
            <polygon points="0,80 64,44 128,80" fill="rgba(0,0,0,0.15)" />
            <circle
              cx="64"
              cy="44"
              r="10"
              fill={template.theme.accentColor}
              opacity="0.9"
            />
            <text x="64" y="48" textAnchor="middle" fill="white" fontSize="8">
              ♡
            </text>
          </svg>
        </div>

        {/* Ism preview */}
        <div className="text-center">
          <p
            className="font-serif italic text-base leading-tight"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Ism & Ism
          </p>
          <div
            className="w-8 h-px mx-auto mt-1"
            style={{ background: template.theme.accentColor }}
          />
        </div>

        {/* Event badge */}
        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            background: template.theme.accentColor,
            color: template.previewBg,
          }}
        >
          {template.eventType === "WEDDING" ? "To'y" : "Qiz bazmi"}
        </span>
      </div>

      {/* Ma'lumot */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
          <div className="flex gap-1 mt-1">
            {[template.theme.primaryColor, template.theme.accentColor, template.theme.bgColor].map(
              (color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>

        <div className="flex gap-2">
          <Link
            href={`/templates/${template.slug}`}
            className="flex-1 py-2 text-center text-sm font-medium rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: template.theme.primaryColor, color: template.theme.primaryColor }}
          >
            Preview
          </Link>
          <Link
            href={`https://t.me/${TELEGRAM_BOT_USERNAME}?start=template_${template.slug}`}
            target="_blank"
            className="flex-1 py-2 text-center text-sm font-medium rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: template.theme.primaryColor }}
          >
            Buyurtma
          </Link>
        </div>
      </div>
    </div>
  );
}
