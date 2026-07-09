"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import type { InvitationData } from "@/types/invitation";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  data: InvitationData;
  t: (uz: string, ru: string) => string;
}

export default function LocationSection({ data, t }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  const eventLabel =
    data.eventType === "BACHELORETTE"
      ? t("Qiz bazmi manzili", "Место девичника")
      : t("To'y manzili", "Место свадьбы");

  return (
    <section
      className="py-16 px-4 flex justify-center"
      style={{ backgroundColor: "var(--bg, #FAF7F2)" }}
    >
      <div ref={sectionRef} className="w-full max-w-md text-center">
        {/* Bezak ajratuvchi */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: "var(--primary,#8B1A1A)", opacity: 0.2 }} />
          <div className="text-3xl">🍎</div>
          <div className="flex-1 h-px" style={{ background: "var(--primary,#8B1A1A)", opacity: 0.2 }} />
        </div>

        {/* To'yxona nomi */}
        <h2
          className="font-serif italic text-3xl mb-2"
          style={{ color: "var(--primary, #8B1A1A)" }}
        >
          {eventLabel}
        </h2>
        <h3
          className="font-bold text-xl tracking-widest mb-2 uppercase"
          style={{ color: "var(--primary, #8B1A1A)" }}
        >
          {data.venueName}
        </h3>

        <div className="flex items-center justify-center gap-2 mb-1">
          <MapPin size={14} style={{ color: "var(--primary,#8B1A1A)", opacity: 0.6 }} />
          <p
            className="text-sm"
            style={{ color: "var(--primary,#8B1A1A)", opacity: 0.7 }}
          >
            {data.venueAddress}
          </p>
        </div>

        {/* Xarita tugmalari */}
        {(data.yandexMapUrl || data.googleMapUrl) && (
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {data.yandexMapUrl && (
              <a
                href={data.yandexMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-semibold tracking-widest uppercase border transition-all hover:opacity-70"
                style={{
                  borderColor: "var(--primary,#8B1A1A)",
                  color: "var(--primary,#8B1A1A)",
                }}
              >
                {t("Yandex Xaritasi", "Яндекс Карты")}
              </a>
            )}
            {data.googleMapUrl && (
              <a
                href={data.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-semibold tracking-widest uppercase border transition-all hover:opacity-70"
                style={{
                  borderColor: "var(--primary,#8B1A1A)",
                  color: "var(--primary,#8B1A1A)",
                }}
              >
                Google Maps
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
