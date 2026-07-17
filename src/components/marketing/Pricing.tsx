import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
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
            Yashirin to&apos;lovlar yo&apos;q
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-8 transition-all ${
                pkg.isFeatured
                  ? "bg-[#8B1A1A] text-white shadow-2xl scale-[1.02]"
                  : "bg-[#FAF7F2] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
              }`}
            >
              {pkg.isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#2C1810] text-xs font-bold px-4 py-1 rounded-full">
                  ENG MASHHUR
                </span>
              )}

              <h3
                className={`font-bold text-xl mb-1 ${
                  pkg.isFeatured ? "text-white" : "text-[#2C1810] dark:text-white"
                }`}
              >
                {pkg.name}
              </h3>
              {pkg.description && (
                <p
                  className={`text-sm mb-6 ${
                    pkg.isFeatured ? "text-red-200" : "text-gray-400 dark:text-gray-400"
                  }`}
                >
                  {pkg.description}
                </p>
              )}

              <div className="mb-8">
                <span
                  className={`text-4xl font-bold ${
                    pkg.isFeatured ? "text-white" : "text-[#8B1A1A]"
                  }`}
                >
                  {formatPrice(pkg.price)}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    pkg.isFeatured ? "text-red-200" : "text-gray-400 dark:text-gray-400"
                  }`}
                >
                  so&apos;m
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={pkg.isFeatured ? "text-[#C9A84C]" : "text-[#8B1A1A]"}>
                      ✓
                    </span>
                    <span className={pkg.isFeatured ? "text-red-100" : "text-gray-600 dark:text-gray-400"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
                external
                variant={pkg.isFeatured ? "ghost" : "primary"}
                size="lg"
                className={`w-full justify-center ${
                  pkg.isFeatured
                    ? "bg-white text-[#8B1A1A] hover:bg-gray-100 dark:hover:bg-gray-200"
                    : ""
                }`}
              >
                {pkg.isFeatured ? "Eng mashhur" : "Buyurtma berish"} →
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
