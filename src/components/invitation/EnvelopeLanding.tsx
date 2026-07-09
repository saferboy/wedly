"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { EventType } from "@/types/invitation";

interface Props {
  eventType: EventType;
  brideName: string;
  templateSlug: string;
  onOpen: () => void;
  t: (uz: string, ru: string) => string;
}

export default function EnvelopeLanding({
  eventType,
  brideName,
  onOpen,
  t,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const inviteText =
    eventType === "BACHELORETTE"
      ? t("SIZ QIZ BAZMIGA\nTAKLIF ETILGANSIZ", "ВЫ ПРИГЛАШЕНЫ\nНА ДЕВИЧНИК")
      : t("SIZ TO'YGA\nTAKLIF ETILGANSIZ", "ВЫ ПРИГЛАШЕНЫ\nНА СВАДЬБУ");

  useEffect(() => {
    // Kirish animatsiyasi
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(
      sealRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.7)" }
    );
  }, []);

  const handleOpen = () => {
    const tl = gsap.timeline({ onComplete: onOpen });

    // Muhr yo'qoladi
    tl.to(sealRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });

    // Yuqori qopqoq ochiladi
    tl.to(
      flapRef.current,
      {
        rotateX: -180,
        duration: 0.6,
        ease: "power2.inOut",
        transformOrigin: "top center",
      },
      "-=0.1"
    );

    // Butun konvert kichrayib yo'qoladi
    tl.to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      y: -40,
      duration: 0.5,
      ease: "power2.in",
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--primary, #8B1A1A)" }}
    >
      {/* Konvert */}
      <div
        ref={containerRef}
        className="relative cursor-pointer select-none"
        style={{ width: "min(520px, 90vw)", perspective: "1000px" }}
        onClick={handleOpen}
      >
        {/* Yon chiziqlar (konvert ko'rinishi) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 520 360"
          fill="none"
        >
          <line x1="0" y1="360" x2="260" y2="180" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
          <line x1="520" y1="360" x2="260" y2="180" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
          <line x1="0" y1="0" x2="260" y2="180" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
          <line x1="520" y1="0" x2="260" y2="180" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
        </svg>

        {/* Konvert tanasi */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            aspectRatio: "520/360",
            background: "rgba(0,0,0,0.15)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          {/* Yuqori qopqoq */}
          <div
            ref={flapRef}
            className="absolute top-0 left-0 w-full"
            style={{
              height: "50%",
              background: "var(--primary, #8B1A1A)",
              transformOrigin: "top center",
              zIndex: 2,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          {/* Pastki uchburchak */}
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{
              height: "50%",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0%)",
              background: "rgba(0,0,0,0.2)",
              zIndex: 1,
            }}
          />

          {/* Matn */}
          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8"
          >
            <p
              className="text-center font-bold tracking-[0.2em] text-sm mb-2"
              style={{ color: "rgba(201,168,76,0.7)" }}
            >
              {brideName}
            </p>
            <p
              className="text-center font-bold tracking-widest leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                whiteSpace: "pre-line",
              }}
            >
              {inviteText}
            </p>
            <p
              className="mt-6 text-xs tracking-[0.3em] animate-pulse"
              style={{ color: "rgba(201,168,76,0.8)" }}
            >
              {t("ochish uchun bosing", "нажмите чтобы открыть")}
            </p>
          </div>
        </div>

        {/* Mum muhri */}
        <div
          ref={sealRef}
          className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full shadow-lg"
          style={{
            bottom: "-28px",
            width: "56px",
            height: "56px",
            background: "radial-gradient(circle at 35% 35%, #D4AF37, #8B6914)",
            border: "2px solid rgba(201,168,76,0.6)",
          }}
        >
          <span className="text-white text-xs font-serif tracking-wider">
            {eventType === "BACHELORETTE" ? "♡" : "∞"}
          </span>
        </div>
      </div>

      {/* Pastdagi ism */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        style={{ color: "rgba(201,168,76,0.6)" }}
      >
        <p className="text-xs tracking-[0.3em] uppercase">{t("muhddan by", "подготовлено")}</p>
        <p className="text-sm tracking-widest font-light mt-1">
          {brideName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
