"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Kechikish (ms) — grid elementlarini bosqichma-bosqich chiqarish uchun. */
  delay?: number;
}

/**
 * Scroll paytida ko'rinishga kirganda kontentni yumshoq "float-in" qiladi.
 * IntersectionObserver bir marta ishlaydi (ko'ringach kuzatuvni to'xtatadi).
 */
export default function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-on-scroll ${shown ? "is-visible" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
