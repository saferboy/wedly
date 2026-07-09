"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ShoppingBag,
  Globe,
  Music,
  Plus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV = [
  { href: "/admin/orders", label: "Buyurtmalar", icon: ShoppingBag },
  { href: "/admin/invitations", label: "Takliflar", icon: Globe },
  { href: "/admin/create", label: "Yangi taklif", icon: Plus },
  { href: "/admin/music", label: "Musiqa", icon: Music },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sahifa almashganda mobil drawer avtomatik yopilsin
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobil top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="font-serif italic text-lg text-[#8B1A1A]">
          Wedly
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menyuni ochish"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Orqa fon (mobil drawer ochiq bo'lganda) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-56 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <Link href="/" className="font-serif italic text-xl text-[#8B1A1A]">
              Wedly
            </Link>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Admin panel</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Menyuni yopish"
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-[#8B1A1A] text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 w-full transition-all"
          >
            <LogOut size={16} />
            Chiqish
          </button>
          <div className="flex items-center px-3">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
