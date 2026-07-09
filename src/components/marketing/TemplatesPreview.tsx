import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { TEMPLATES } from "@/lib/templates";

export default function TemplatesPreview() {
  const featured = TEMPLATES.slice(0, 3);

  return (
    <section className="py-24 bg-[#FAF7F2] dark:bg-gray-950">
      <Container>
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#C9A84C] uppercase">
            ✦ Dizaynlar ✦
          </span>
          <h2 className="mt-3 text-4xl font-serif italic text-[#2C1810] dark:text-white">
            Chiroyli templatelar
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            To'y va qiz bazmi uchun 6 ta noyob dizayn. Har biri o'z rang
            sxemasi va uslubi bilan.
          </p>
        </div>

        {/* Template kartalar */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featured.map((template) => (
            <Link
              key={template.slug}
              href={`/templates/${template.slug}`}
              className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Preview */}
              <div
                className="h-52 flex flex-col items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ backgroundColor: template.previewBg }}
              >
                <p
                  className="font-serif italic text-2xl"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {template.eventType === "WEDDING"
                    ? "Jasur & Nilufar"
                    : "Malika"}
                </p>
                <div
                  className="w-8 h-px"
                  style={{ background: template.theme.accentColor }}
                />
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: template.theme.accentColor,
                    color: template.previewBg,
                  }}
                >
                  {template.name}
                </span>
              </div>

              {/* Info */}
              <div className="bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {template.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {template.eventType === "WEDDING" ? "To'y" : "Qiz bazmi"}
                  </p>
                </div>
                <span className="text-xs text-[#8B1A1A] font-medium group-hover:translate-x-1 transition-transform inline-block">
                  Preview →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button href="/templates" variant="outline" size="lg">
            Barcha 6 ta templateni ko'rish
          </Button>
        </div>
      </Container>
    </section>
  );
}
