"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  eventDate: string;
  t: (uz: string, ru: string) => string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(eventDate: string): TimeLeft {
  const diff = new Date(eventDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ eventDate, t }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(eventDate));
  const isPast = new Date(eventDate).getTime() <= Date.now();

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

  useEffect(() => {
    if (isPast) return;
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate, isPast]);

  const units = [
    { value: timeLeft.days, label: t("Kun", "Дней") },
    { value: timeLeft.hours, label: t("Soat", "Часов") },
    { value: timeLeft.minutes, label: t("Daqiqa", "Минут") },
    { value: timeLeft.seconds, label: t("Soniya", "Секунд") },
  ];

  return (
    <section
      className="py-20 px-4 text-center"
      style={{ backgroundColor: "var(--bg, #FAF7F2)" }}
    >
      <div ref={sectionRef}>
        <h2
          className="font-serif italic text-3xl mb-10"
          style={{ color: "var(--primary, #8B1A1A)" }}
        >
          {t("Har lahzani sanayapmiz", "Считаем каждый момент")}
        </h2>

        {isPast ? (
          <div>
            <p
              className="text-lg font-medium"
              style={{ color: "var(--primary,#8B1A1A)" }}
            >
              {t("Bugun aynan o'sha kun. Sizni kutaman! 🌹", "Сегодня этот день. Жду вас! 🌹")}
            </p>
          </div>
        ) : (
          <div className="flex items-start justify-center gap-4 md:gap-8">
            {units.map(({ value, label }, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="font-serif text-5xl md:text-6xl leading-none"
                  style={{ color: "var(--primary, #8B1A1A)" }}
                >
                  {pad(value)}
                </span>
                {i < units.length - 1 && (
                  <span
                    className="absolute text-4xl -translate-y-1"
                    style={{
                      color: "var(--accent,#C9A84C)",
                      position: "relative",
                      marginLeft: "calc(100% + 0.5rem)",
                    }}
                  />
                )}
                <span
                  className="text-xs mt-2 tracking-widest"
                  style={{ color: "var(--primary,#8B1A1A)", opacity: 0.5 }}
                >
                  {label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer bezak */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="text-4xl">🌺</div>
          <p
            className="text-xs tracking-widest"
            style={{ color: "var(--primary,#8B1A1A)", opacity: 0.3 }}
          >
            BY WEDLY
          </p>
        </div>
      </div>
    </section>
  );
}
