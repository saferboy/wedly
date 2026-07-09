"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import type { InvitationData } from "@/types/invitation";

interface Props {
  data: InvitationData;
  t: (uz: string, ru: string) => string;
}

export default function HeroSection({ data, t }: Props) {
  const namesRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      namesRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(
      decorRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const isWedding = data.eventType === "WEDDING";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4"
      style={{ backgroundColor: "var(--bg, #FAF7F2)" }}
    >
      {/* Yuqori bezak chizig'i */}
      <div
        ref={decorRef}
        className="absolute top-0 left-0 right-0 h-4"
        style={{
          background: "repeating-linear-gradient(90deg, var(--primary,#8B1A1A) 0px, var(--primary,#8B1A1A) 8px, transparent 8px, transparent 16px)",
          opacity: 0.15,
        }}
      />

      {/* Surnay bezaklari (to'y uchun) */}
      {isWedding && (
        <div className="flex items-center gap-4 mb-6 opacity-70">
          <div className="text-3xl" style={{ color: "var(--accent,#C9A84C)" }}>
            𝄞
          </div>
          <div className="h-px w-16" style={{ background: "var(--accent,#C9A84C)" }} />
          <div className="text-3xl scale-x-[-1]" style={{ color: "var(--accent,#C9A84C)" }}>
            𝄞
          </div>
        </div>
      )}

      {/* Ismlar */}
      <div ref={namesRef} className="text-center z-10">
        {isWedding && data.groomName ? (
          <>
            <h1
              className="font-serif italic leading-none"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "var(--primary,#8B1A1A)",
                fontFamily: "var(--font-script, Georgia, serif)",
              }}
            >
              {data.groomName}
            </h1>
            <div
              className="text-2xl my-2"
              style={{ color: "var(--accent,#C9A84C)" }}
            >
              &
            </div>
            <h1
              className="font-serif italic leading-none"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "var(--primary,#8B1A1A)",
                fontFamily: "var(--font-script, Georgia, serif)",
              }}
            >
              {data.brideName}
            </h1>
          </>
        ) : (
          <h1
            className="font-serif italic leading-none"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              color: "var(--primary,#8B1A1A)",
              fontFamily: "var(--font-script, Georgia, serif)",
            }}
          >
            {data.brideName}
          </h1>
        )}
      </div>

      {/* Rasm yoki illustratsiya */}
      <div className="mt-8 mb-4 relative">
        {data.photoUrl ? (
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 shadow-lg"
            style={{ borderColor: "var(--accent,#C9A84C)" }}>
            <Image
              src={data.photoUrl}
              alt={data.brideName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="text-8xl text-center"
            style={{ color: "var(--primary,#8B1A1A)", opacity: 0.8 }}
          >
            {isWedding ? "👰🤵" : "👰"}
          </div>
        )}
      </div>

      {/* Pastga scroll ko'rsatgich */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <p
          className="text-xs tracking-widest"
          style={{ color: "var(--primary,#8B1A1A)", opacity: 0.5 }}
        >
          {t("PASTGA AYLANTIRISHINGIZNI SO'RAYMIZ", "ПРОКРУТИТЕ ВНИЗ")}
        </p>
        <div
          className="w-px h-6"
          style={{ background: "var(--primary,#8B1A1A)", opacity: 0.3 }}
        />
      </div>
    </section>
  );
}
