import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";
import { db } from "@/lib/db";

function formatPrice(price: number) {
  return new Intl.NumberFormat("uz-UZ").format(price);
}

export default async function Pricing() {
  const packages = await db.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (packages.length === 0) return null;

  return (
    <section id="pricing" className="bg-white py-16 sm:py-20 lg:py-24 dark:bg-night">
      <Container>
        <Reveal className="mb-10 text-center sm:mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9782a] sm:text-xs dark:text-gold">
            ✦ Narxlar ✦
          </span>
          <h2 className="mt-3 font-serif text-2xl text-[#2C1810] sm:text-3xl lg:text-4xl dark:text-white">
            Oddiy va tushunarli
          </h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base dark:text-gray-400">
            Yashirin to&apos;lovlar yo&apos;q
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-3xl gap-5 sm:gap-6 md:grid-cols-2">
          {packages.map((pkg, i) => (
            <Reveal
              key={pkg.id}
              delay={i * 120}
              className={`relative h-full rounded-2xl p-6 transition-all sm:p-8 ${
                pkg.isFeatured
                  ? "border border-gold/40 bg-[#151210] text-white shadow-[0_20px_60px_-20px_rgba(201,168,76,0.4)] dark:bg-night-soft"
                  : "border border-gray-100 bg-[#FAF7F2] text-[#2C1810] shadow-sm dark:border-white/5 dark:bg-night-soft dark:text-white"
              }`}
            >
              {pkg.isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#e6c976] to-[#c9a84c] px-4 py-1 text-xs font-bold text-[#2a2012]">
                  ENG MASHHUR
                </span>
              )}

              <h3 className="mb-1 font-serif text-xl">{pkg.name}</h3>
              {pkg.description && (
                <p
                  className={`mb-6 text-sm ${
                    pkg.isFeatured ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {pkg.description}
                </p>
              )}

              <div className="mb-7">
                <span
                  className={`font-serif text-3xl font-bold sm:text-4xl ${
                    pkg.isFeatured ? "text-gold" : "text-[#a9782a] dark:text-gold"
                  }`}
                >
                  {formatPrice(pkg.price)}
                </span>
                <span
                  className={`ml-1 text-sm ${
                    pkg.isFeatured ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  so&apos;m
                </span>
              </div>

              <ul className="mb-7 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-gold">✓</span>
                    <span
                      className={
                        pkg.isFeatured
                          ? "text-gray-300"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                external
                variant={pkg.isFeatured ? "gold" : "goldOutline"}
                size="md"
                className="w-full justify-center"
              >
                {pkg.isFeatured ? "Eng mashhur" : "Buyurtma berish"} →
              </Button>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
