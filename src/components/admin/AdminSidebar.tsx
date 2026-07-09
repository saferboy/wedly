"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Globe,
  Music,
  Plus,
  LogOut,
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

  return (
    <aside className="w-56 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="font-serif italic text-xl text-[#8B1A1A]">
          Wedly
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Admin panel</p>
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
  );
}
