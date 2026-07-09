"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InvitationData } from "@/types/invitation";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  data: InvitationData;
  t: (uz: string, ru: string) => string;
}

export default function LetterSection({ data, t }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      }
    );
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const letterText = t(data.letterText, data.letterTextRu) ||
    t(
      `Aziz va qadrdon yaqinim!\n\nHayotimdagi unutilmas kunlardan biri — ${
        data.eventType === "BACHELORETTE" ? "qiz bazmi" : "to'y"
      }ni siz bilan birga nishonlashni niyat qildim.\n\nSizni ushbu kechaga samimiy taklif etaman.\n\nQuvonchli kunimda aziz mehmonim bo'lishingizni intizorlik bilan kutaman.`,
      `Дорогой и близкий мне человек!\n\nОдин из самых незабываемых дней моей жизни — ${
        data.eventType === "BACHELORETTE" ? "девичник" : "свадьба"
      } — я хочу отметить вместе с вами.\n\nСердечно приглашаю вас на этот вечер.\n\nС нетерпением жду вас на своём радостном торжестве.`
    );

  return (
    <section
      className="py-16 px-4 flex justify-center"
      style={{ backgroundColor: "var(--bg, #FAF7F2)" }}
    >
      <div
        ref={cardRef}
        className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-xl"
        style={{ background: "var(--primary, #8B1A1A)" }}
      >
        {/* Karta matni */}
        <div className="px-8 pt-10 pb-6 text-center">
          <p
            className="font-serif italic text-2xl mb-6 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {t("Aziz va qadrdon\nyaqinim!", "Дорогой и близкий\nмне человек!")}
          </p>
          <div
            className="text-sm leading-loose whitespace-pre-line"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {letterText}
          </div>

          {/* Karta raqami (agar mavjud bo'lsa) */}
          {data.cardNumber && (
            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: "rgba(201,168,76,0.3)" }}
            >
              <p
                className="text-xs tracking-widest mb-2"
                style={{ color: "rgba(201,168,76,0.7)" }}
              >
                {t("TO'YONA UCHUN", "ДЛЯ ПОДАРКА")}
              </p>
              <p
                className="font-mono text-lg tracking-widest"
                style={{ color: "rgba(201,168,76,0.95)" }}
              >
                {data.cardNumber}
              </p>
              {data.cardHolder && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {data.cardHolder}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pastki naqsh borderi */}
        <div
          className="h-16 w-full"
          style={{
            background: "linear-gradient(135deg, #c0392b 25%, transparent 25%) -10px 0, linear-gradient(225deg, #c0392b 25%, transparent 25%) -10px 0, linear-gradient(315deg, #c0392b 25%, transparent 25%), linear-gradient(45deg, #c0392b 25%, transparent 25%)",
            backgroundSize: "20px 20px",
            backgroundColor: "rgba(201,168,76,0.15)",
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
}
