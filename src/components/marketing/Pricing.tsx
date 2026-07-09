import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

const PLANS = [
  {
    name: "Standart",
    price: "79 000",
    currency: "so'm",
    description: "To'y yoki qiz bazmi uchun",
    features: [
      "6 ta seksiya (konvert, ismlar, xat, sana, manzil, timer)",
      "1 ta template tanlash",
      "UZ / RU til qo'llab-quvvatlash",
      "Fon musiqasi",
      "30 kun faol",
      "Yandex va Google xaritasi",
    ],
    highlight: false,
    cta: "Buyurtma berish",
  },
  {
    name: "Premium",
    price: "129 000",
    currency: "so'm",
    description: "Eng ko'p tanlangan",
    features: [
      "Standart funksiyalar barchasi",
      "Shaxsiy xat matni (o'z so'zlaringiz)",
      "To'yxona rasmi",
      "To'yona karta raqami bloki",
      "O'z musiqangizni yuklash",
      "90 kun faol",
      "Tezkor tayyorlash (12 soat)",
    ],
    highlight: true,
    cta: "Eng mashhur",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
      <Container>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#C9A84C] uppercase">
            ✦ Narxlar ✦
          </span>
          <h2 className="mt-3 text-4xl font-serif italic text-[#2C1810] dark:text-white">
            Oddiy va tushunarli
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Yashirin to'lovlar yo'q
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.highlight
                  ? "bg-[#8B1A1A] text-white shadow-2xl scale-[1.02]"
                  : "bg-[#FAF7F2] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#2C1810] text-xs font-bold px-4 py-1 rounded-full">
                  ENG MASHHUR
                </span>
              )}

              <h3
                className={`font-bold text-xl mb-1 ${
                  plan.highlight ? "text-white" : "text-[#2C1810] dark:text-white"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  plan.highlight ? "text-red-200" : "text-gray-400 dark:text-gray-400"
                }`}
              >
                {plan.description}
              </p>

              <div className="mb-8">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlight ? "text-white" : "text-[#8B1A1A]"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    plan.highlight ? "text-red-200" : "text-gray-400 dark:text-gray-400"
                  }`}
                >
                  {plan.currency}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={plan.highlight ? "text-[#C9A84C]" : "text-[#8B1A1A]"}
                    >
                      ✓
                    </span>
                    <span className={plan.highlight ? "text-red-100" : "text-gray-600 dark:text-gray-400"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                external
                variant={plan.highlight ? "ghost" : "primary"}
                size="lg"
                className={`w-full justify-center ${
                  plan.highlight
                    ? "bg-white text-[#8B1A1A] hover:bg-gray-100 dark:hover:bg-gray-200"
                    : ""
                }`}
              >
                {plan.cta} →
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
