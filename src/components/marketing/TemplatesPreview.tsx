import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { TEMPLATES } from "@/lib/templates";
import { eventTypeLabel } from "@/lib/eventType";

const PREVIEW_NAME: Record<string, string> = {
  WEDDING: "Jasur & Nilufar",
  BACHELORETTE: "Malika",
  BIRTHDAY: "Diyora",
};

export default function TemplatesPreview() {
  const featured = TEMPLATES.slice(0, 3);

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-20 lg:py-24 dark:bg-night-soft">
      <Container>
        <Reveal className="mb-10 text-center sm:mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a9782a] sm:text-xs dark:text-gold">
            ✦ Dizaynlar ✦
          </span>
          <h2 className="mt-3 font-serif text-2xl text-[#2C1810] sm:text-3xl lg:text-4xl dark:text-white">
            Chiroyli templatelar
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base dark:text-gray-400">
            To&apos;y, qiz bazmi va tug&apos;ilgan kun uchun 6 ta noyob dizayn. Har
            biri o&apos;z rang sxemasi va uslubi bilan.
          </p>
        </Reveal>

        {/* Template kartalar */}
        <div className="mb-8 grid gap-5 sm:mb-10 sm:gap-6 md:grid-cols-3">
          {featured.map((template, i) => (
            <Reveal key={template.slug} delay={i * 120} className="h-full">
              <Link
                href={`/templates/${template.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-white/5"
              >
              {/* Preview */}
              <div
                className="flex h-44 flex-col items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-[1.03] sm:h-52"
                style={{ backgroundColor: template.previewBg }}
              >
                <p
                  className="font-serif text-2xl italic"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {PREVIEW_NAME[template.eventType] ?? "Malika"}
                </p>
                <div
                  className="h-px w-8"
                  style={{ background: template.theme.accentColor }}
                />
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: template.theme.accentColor,
                    color: template.previewBg,
                  }}
                >
                  {template.name}
                </span>
              </div>

              {/* Info */}
              <div className="flex items-center justify-between bg-white p-4 dark:bg-night">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {eventTypeLabel(template.eventType)}
                  </p>
                </div>
                <span className="inline-block text-xs font-medium text-[#a9782a] transition-transform group-hover:translate-x-1 dark:text-gold">
                  Preview →
                </span>
              </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <Button href="/templates" variant="goldOutline" size="md">
            Qolgan templatelarni ko&apos;rish
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
