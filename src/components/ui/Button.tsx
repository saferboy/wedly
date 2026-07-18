import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "gold" | "outline" | "goldOutline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-full transition-all duration-200 whitespace-nowrap";

  const variants = {
    primary: "bg-[#8B1A1A] text-white hover:bg-[#6B0F0F] shadow-sm hover:shadow-md",
    gold:
      "bg-gradient-to-b from-[#e6c976] to-[#c9a84c] text-[#2a2012] shadow-[0_10px_30px_-10px_rgba(201,168,76,0.7)] hover:from-[#eed08a] hover:to-[#d4b45a] hover:shadow-[0_12px_34px_-8px_rgba(201,168,76,0.8)]",
    outline: "border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white",
    goldOutline:
      "border border-[#c9a84c]/60 text-[#a9782a] dark:text-[#e6c976] hover:border-[#c9a84c] hover:bg-[#c9a84c]/10",
    ghost: "text-[#8B1A1A] hover:bg-red-50",
  };

  // Kichraytirilgan o'lchamlar (kamroq width/height)
  const sizes = {
    sm: "text-xs px-3.5 py-1.5",
    md: "text-[13px] px-5 py-2.5",
    lg: "text-sm px-6 py-3",
  };

  const cls = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
