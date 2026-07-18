"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/templates", label: "Templatelar" },
  { href: "#how-it-works", label: "Qanday ishlaydi" },
  { href: "#pricing", label: "Narxlar" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/85 border-b border-black/5 backdrop-blur-md dark:bg-night/80 dark:border-white/5">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5" onClick={() => setOpen(false)}>
            <span className="headline-accent text-xl sm:text-2xl font-serif italic">
              Wedly
            </span>
            <span className="text-xs text-gold">✦</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-sm text-gray-600 hover:text-[#2C1810] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all after:duration-300 dark:text-gray-300 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button href="/templates" variant="gold" size="sm" className="hidden sm:inline-flex">
              Boshlash →
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
              aria-expanded={open}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-black/5 hover:text-[#2C1810] transition-colors dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobil menyu */}
        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-black/5 hover:text-[#a9782a] transition-colors dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <Button href="/templates" variant="gold" size="sm" className="mt-2 justify-center">
              Boshlash →
            </Button>
          </nav>
        )}
      </Container>
    </header>
  );
}
