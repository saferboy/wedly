"use client";

import { useState } from "react";

interface Props {
  slug: string;
}

export default function CopyLinkButton({ slug }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/i/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API mavjud bo'lmasa (masalan http) — foydalanuvchi qo'lda nusxalaydi.
      window.prompt("Havolani nusxalang:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[10px] font-medium px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:border-[#8B1A1A] hover:text-[#8B1A1A] dark:border-gray-700 dark:text-gray-400 dark:hover:border-[#C9A44C] dark:hover:text-[#C9A44C] transition-colors"
    >
      {copied ? "Nusxalandi ✓" : "Nusxalash"}
    </button>
  );
}
