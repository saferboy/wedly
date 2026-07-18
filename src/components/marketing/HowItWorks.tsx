import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    num: "01",
    icon: "🎨",
    title: "Template tanlang",
    desc: "To'y, qiz bazmi yoki tug'ilgan kun uchun 6 ta chiroyli dizayndan birini tanlang. Preview orqali to'liq ko'rishingiz mumkin.",
  },
  {
    num: "02",
    icon: "📝",
    title: "Ma'lumotlarni to'ldiring",
    desc: "Saytdagi qulay forma orqali ismlar, sana, manzil va musiqani kiriting. So'ng to'lovni Telegram orqali bir necha soniyada yakunlang.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Tayyor link oling",
    desc: "24 soat ichida shaxsiy taklifnoma saytingiz tayyor. Linkni do'stlaringiz bilan ulashing!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20 lg:py-24 dark:bg-night">
      <Container>
        {/* Sarlavha */}
        <Reveal className="mb-10 text-center sm:mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9782a] sm:text-xs dark:text-gold">
            ✦ Jarayon ✦
          </span>
          <h2 className="mt-3 font-serif text-2xl text-[#2C1810] sm:text-3xl lg:text-4xl dark:text-white">
            Qanday ishlaydi?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base dark:text-gray-400">
            Atigi 3 qadam — va sizning taklifnomangiz tayyor
          </p>
        </Reveal>

        {/* Qadamlar */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              key={i}
              delay={i * 120}
              className="relative h-full rounded-2xl border border-gray-100 bg-[#FAF7F2] p-6 text-center sm:p-7 dark:border-white/5 dark:bg-night-soft"
            >
              {/* Ikonka + raqam */}
              <div className="relative mb-5 inline-block">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#e6c976] to-[#c9a84c] text-[11px] font-bold text-[#2a2012]">
                  {i + 1}
                </span>
              </div>

              <h3 className="mb-2 font-serif text-lg text-[#2C1810] dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
