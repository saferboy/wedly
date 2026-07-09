"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InvitationData, Language } from "@/types/invitation";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  data: InvitationData;
  t: (uz: string, ru: string) => string;
}

const DAYS = {
  uz: ["Ya", "Du", "Se", "Chor", "Pay", "Ju", "Sha"],
  ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
};

const MONTHS = {
  uz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Sunday=0 → shift so Monday is first
  const offset = (firstDay + 6) % 7;
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return { cells, month, year, day: date.getDate() };
}

export default function DateSection({ data, t }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lang: Language = "uz"; // useLang() ishlatsa bo'ladi, hozircha default

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

  const date = new Date(data.eventDate);
  const { cells, month, year, day } = buildCalendar(date);
  const days = DAYS[lang];
  const monthName = MONTHS[lang][month];

  return (
    <section
      className="py-16 px-4 flex justify-center"
      style={{ backgroundColor: "var(--bg, #FAF7F2)" }}
    >
      <div ref={sectionRef} className="w-full max-w-md">
        {/* Anor bezak */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: "var(--primary,#8B1A1A)", opacity: 0.2 }} />
          <div className="text-3xl">🍎</div>
          <div className="flex-1 h-px" style={{ background: "var(--primary,#8B1A1A)", opacity: 0.2 }} />
        </div>

        {/* Oy nomi */}
        <h2
          className="text-center font-serif italic text-3xl mb-6"
          style={{ color: "var(--primary, #8B1A1A)" }}
        >
          {monthName}, {year}
        </h2>

        {/* Kalendar */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold py-1 tracking-wider"
              style={{ color: "var(--primary,#8B1A1A)", opacity: 0.5 }}
            >
              {d.toUpperCase()}
            </div>
          ))}
          {cells.map((cell, i) => (
            <div key={i} className="flex items-center justify-center h-10">
              {cell !== null && (
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all"
                  style={
                    cell === day
                      ? {
                          background: "radial-gradient(circle at 35% 35%, #D4AF37, #8B6914)",
                          color: "white",
                          fontWeight: "bold",
                          boxShadow: "0 2px 8px rgba(201,168,76,0.4)",
                        }
                      : { color: "var(--primary,#8B1A1A)" }
                  }
                >
                  {cell === day ? (
                    <span className="text-xs">♥</span>
                  ) : (
                    cell
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Soat */}
        <p
          className="text-center text-sm tracking-widest mt-4"
          style={{ color: "var(--primary,#8B1A1A)", opacity: 0.7 }}
        >
          {t(`Soat ${data.eventTime} da`, `В ${data.eventTime}`)}
        </p>
      </div>
    </section>
  );
}
