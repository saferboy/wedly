import Link from "next/link";
import Container from "@/components/ui/Container";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-white py-12">
      <Container>
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif italic text-3xl text-white mb-2">Wedly</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              O'zbekistondagi to'y va qiz bazmi uchun chiroyli onlayn
              taklifnomalar.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-sm tracking-widest text-[#C9A84C] uppercase mb-4">
              Sahifalar
            </p>
            <ul className="space-y-2">
              {[
                { href: "/templates", label: "Templatelar" },
                { href: "#how-it-works", label: "Qanday ishlaydi" },
                { href: "#pricing", label: "Narxlar" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm tracking-widest text-[#C9A84C] uppercase mb-4">
              Aloqa
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>🤖</span> @{TELEGRAM_BOT_USERNAME}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Wedly. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-gray-600 font-serif italic">
            Har bir muhabbat noyob ✦
          </p>
        </div>
      </Container>
    </footer>
  );
}
