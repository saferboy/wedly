"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import type { EventType } from "@/types/invitation";

type Filter = "ALL" | EventType;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered =
    filter === "ALL" ? TEMPLATES : TEMPLATES.filter((t) => t.eventType === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl font-serif italic text-gray-900 mb-2">
            Templatelar
          </h1>
          <p className="text-gray-500">
            To'y yoki qiz bazmi uchun o'zingizga mos dizaynni tanlang
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filter */}
        <div className="flex gap-2 justify-center mb-10">
          {(["ALL", "WEDDING", "BACHELORETTE"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-[#8B1A1A] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {f === "ALL" ? "Barchasi" : f === "WEDDING" ? "To'y" : "Qiz bazmi"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}
