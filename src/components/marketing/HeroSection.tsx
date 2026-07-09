import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF7F2] pt-16">
      {/* Fon naqshlari */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B1A1A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Chap dekor chizig'i */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent opacity-30" />

      <Container className="relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Chap: Matn */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.3em] text-[#C9A84C] uppercase mb-6">
              ✦ Onlayn to'y taklifnomalari ✦
            </span>

            <h1 className="font-serif text-5xl lg:text-6xl leading-tight text-[#2C1810] mb-6">
              Sevgi{" "}
              <span className="italic text-[#8B1A1A]">taklifnomasini</span>
              <br />
              onlayn ulashing
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              To'y yoki qiz bazmi uchun chiroyli raqamli taklifnoma yarating.
              Template tanlang, ma'lumot qoldiring — biz 24 soat ichida
              tayyor qilamiz.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/templates" size="lg">
                Templateni ko'rish
              </Button>
              <Button
                href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                variant="outline"
                size="lg"
                external
              >
                Telegram orqali buyurtma
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
              {[
                { value: "200+", label: "Taklifnoma yaratildi" },
                { value: "24h", label: "Tayyorlanish vaqti" },
                { value: "6", label: "Dizayn uslubi" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#8B1A1A]">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O'ng: Mini taklif preview */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Asosiy karta */}
            <div className="relative w-80 h-[480px] rounded-3xl shadow-2xl overflow-hidden">
              {/* Konvert */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{
                  background: "linear-gradient(145deg, #8B1A1A 0%, #6B0F0F 100%)",
                }}
              >
                <svg
                  className="w-40 h-24 opacity-40"
                  viewBox="0 0 160 100"
                  fill="none"
                >
                  <rect width="160" height="100" rx="4" fill="rgba(0,0,0,0.2)" />
                  <polygon points="0,0 80,55 160,0" fill="rgba(255,255,255,0.1)" />
                  <polygon points="0,100 80,55 160,100" fill="rgba(0,0,0,0.1)" />
                </svg>
                <div className="text-center">
                  <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">
                    Taklif
                  </p>
                  <p className="text-white font-serif italic text-2xl leading-tight">
                    Jasur
                  </p>
                  <p className="text-[#C9A84C] text-lg">&</p>
                  <p className="text-white font-serif italic text-2xl leading-tight">
                    Nilufar
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #D4AF37, #8B6914)",
                  }}
                >
                  <span className="text-white">∞</span>
                </div>
                <p className="text-[#C9A84C]/60 text-xs tracking-widest">
                  ochish uchun bosing
                </p>
              </div>
            </div>

            {/* Dekor kartalar */}
            <div
              className="absolute -left-8 top-12 w-40 h-56 rounded-2xl shadow-xl -rotate-6 opacity-60"
              style={{ background: "linear-gradient(145deg, #C2185B, #880E4F)" }}
            />
            <div
              className="absolute -right-6 bottom-12 w-36 h-52 rounded-2xl shadow-xl rotate-6 opacity-50"
              style={{ background: "linear-gradient(145deg, #1B2A4A, #0F1A30)" }}
            />
          </div>
        </div>
      </Container>

      {/* Pastki to'lqin */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 30C360 60 1080 0 1440 30V60H0V30Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
