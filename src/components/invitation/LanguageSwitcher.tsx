"use client";

import type { Language } from "@/types/invitation";

interface Props {
  lang: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ lang, onChange }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-white/80 backdrop-blur-sm rounded-full px-1 py-1 shadow-sm">
      <button
        onClick={() => onChange("ru")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "ru"
            ? "bg-[var(--primary,#8B1A1A)] text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        RU
      </button>
      <button
        onClick={() => onChange("uz")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          lang === "uz"
            ? "bg-[var(--primary,#8B1A1A)] text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
      UZ
      </button>
    </div>
  );
}
