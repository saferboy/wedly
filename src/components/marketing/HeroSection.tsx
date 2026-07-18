import { Users, Clock, Heart, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

const STATS = [
  { icon: Users, value: "200+", label: "Mamnun mijozlar" },
  { icon: Clock, value: "24h", label: "Ichida tayyor" },
  { icon: Heart, value: "6", label: "Yillik tajriba" },
  { icon: ShieldCheck, value: "100%", label: "Sifat kafolati" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-16 text-[#2C1810] dark:bg-night dark:text-white">
      {/* Iliq oltin nur va vinyetka */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,_rgba(201,168,76,0.14),_transparent_60%)] blur-2xl dark:bg-[radial-gradient(circle,_rgba(201,168,76,0.16),_transparent_60%)]" />
        <div className="absolute -left-24 bottom-0 h-[50%] w-[50%] rounded-full bg-[radial-gradient(circle,_rgba(201,168,76,0.10),_transparent_60%)] blur-2xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 pt-8 pb-14 lg:grid-cols-2 lg:gap-12 lg:pt-14 lg:pb-20">
          {/* Chap: Matn */}
          <div className="text-center lg:text-left">
            <Reveal>
              <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#a9782a] dark:text-gold">
                ✦ Onlayn to&apos;y taklifnomalari ✦
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-5 font-serif text-[2rem] leading-[1.15] sm:text-4xl lg:text-5xl">
                Sevgi{" "}
                <span className="headline-accent italic">taklifnomasini</span>
                <br className="hidden sm:block" /> onlayn ulashing
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-600 lg:mx-0 lg:text-[15px] dark:text-gray-400">
                To&apos;y, qiz bazmi yoki tug&apos;ilgan kun uchun chiroyli raqamli
                taklifnoma yarating. Template tanlang, ma&apos;lumot qoldiring — biz
                24 soat ichida tayyor qilamiz.
              </p>
            </Reveal>

            <Reveal delay={270}>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button
                  href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                  external
                  variant="gold"
                  size="md"
                >
                  <Sparkles size={15} /> Buyurtma berish
                </Button>
                <Button href="/templates" variant="goldOutline" size="md">
                  <BookOpen size={15} /> Templatelarni ko&apos;rish
                </Button>
              </div>
            </Reveal>
          </div>

          {/* O'ng: Taklifnoma namunasi (ikkala temada ham bir xil) */}
          <Reveal delay={150} className="relative flex items-center justify-center lg:justify-end">
            {/* Yumshoq oltin nur (ramka orqasida) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_45%,rgba(201,168,76,0.18),transparent_65%)] blur-2xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-invite.png"
              alt="Wedly taklifnoma namunasi — Jasur & Nilufar"
              width={798}
              height={760}
              className="h-auto w-full max-w-[380px] select-none rounded-[1.5rem] border border-gold/20 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] sm:max-w-[440px]"
            />
          </Reveal>
        </div>

        {/* Statistika paneli */}
        <div className="mb-14 rounded-2xl border border-black/5 bg-white/70 px-4 py-6 shadow-sm backdrop-blur-sm sm:px-8 dark:border-white/5 dark:bg-night-soft/70 dark:shadow-none">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center justify-center gap-3 md:justify-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-[#a9782a] dark:border-gold/30 dark:text-gold">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="headline-accent font-serif text-xl sm:text-2xl">{value}</p>
                  <p className="text-[11px] text-gray-500 sm:text-xs dark:text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
