"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import type { EventType } from "@/types/invitation";
import { eventTypeLabel } from "@/lib/eventType";
import Container from "@/components/ui/Container";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

type Filter = "ALL" | EventType;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered =
    filter === "ALL" ? TEMPLATES : TEMPLATES.filter((t) => t.eventType === filter);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-night">
      <Navbar />

      {/* Header band */}
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-16 text-center dark:bg-night">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.14),transparent_60%)] blur-2xl"
        />
        <Container className="relative py-12 sm:py-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9782a] sm:text-xs dark:text-gold">
            ✦ Dizaynlar ✦
          </span>
          <h1 className="mt-3 font-serif text-3xl text-[#2C1810] sm:text-4xl lg:text-5xl dark:text-white">
            Templatelar
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base dark:text-gray-400">
            To&apos;y, qiz bazmi yoki tug&apos;ilgan kun uchun o&apos;zingizga mos
            dizaynni tanlang
          </p>
        </Container>
      </section>

      <Container className="pb-16 sm:pb-24">
        {/* Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10">
          {(["ALL", "WEDDING", "BACHELORETTE", "BIRTHDAY"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 ${
                filter === f
                  ? "bg-gradient-to-b from-[#e6c976] to-[#c9a84c] text-[#2a2012] shadow-[0_8px_20px_-8px_rgba(201,168,76,0.6)]"
                  : "border border-gold/30 bg-white text-gray-600 hover:border-gold/60 hover:text-[#a9782a] dark:bg-night-soft dark:text-gray-300 dark:hover:text-gold"
              }`}
            >
              {f === "ALL" ? "Barchasi" : eventTypeLabel(f)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
