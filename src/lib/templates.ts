import type { EventType, InvitationTheme } from "@/types/invitation";

export interface TemplateConfig {
  slug: string;
  name: string;
  nameRu: string;
  eventType: EventType;
  description: string;
  theme: InvitationTheme;
  previewBg: string;
}

export const TEMPLATES: TemplateConfig[] = [
  // ── TO'Y — PREMIUM (self-contained) ─────────────────────────
  {
    slug: "toy-nikoh",
    name: "Nikoh",
    nameRu: "Никох",
    eventType: "WEDDING",
    description:
      "Zumrad yashil va oltin, uzuklar animatsiyasi — hashamatli nikoh to'yi uslubi",
    previewBg: "#1F4D3D",
    theme: {
      primaryColor: "#1F4D3D",
      secondaryColor: "#143A2C",
      accentColor: "#C9A44C",
      bgColor: "#FAF6EC",
      textColor: "#22332B",
      fontFamily: "'Playfair Display', Georgia, serif",
      envelopeBg: "#1F4D3D",
    },
  },

  // ── TO'Y TEMPLATES ──────────────────────────────────────────
  {
    slug: "classic-red",
    name: "Classic",
    nameRu: "Классик",
    eventType: "WEDDING",
    description: "Qizil va oltin — an'anaviy o'zbek uslubi",
    previewBg: "#8B1A1A",
    theme: {
      primaryColor: "#8B1A1A",
      secondaryColor: "#6B0F0F",
      accentColor: "#C9A84C",
      bgColor: "#FAF7F2",
      textColor: "#2C1810",
      fontFamily: "Georgia, serif",
      envelopeBg: "#8B1A1A",
    },
  },
  {
    slug: "modern-dark",
    name: "Modern",
    nameRu: "Модерн",
    eventType: "WEDDING",
    description: "Minimalist qora va oltin — zamonaviy uslub",
    previewBg: "#1a1a1a",
    theme: {
      primaryColor: "#1a1a1a",
      secondaryColor: "#2d2d2d",
      accentColor: "#D4AF37",
      bgColor: "#F5F5F0",
      textColor: "#1a1a1a",
      fontFamily: "Georgia, serif",
      envelopeBg: "#1a1a1a",
    },
  },
  {
    slug: "luxury-navy",
    name: "Luxury",
    nameRu: "Люкс",
    eventType: "WEDDING",
    description: "To'q ko'k va kumush — hashamatli uslub",
    previewBg: "#1B2A4A",
    theme: {
      primaryColor: "#1B2A4A",
      secondaryColor: "#152038",
      accentColor: "#C0C0C0",
      bgColor: "#F8F8FC",
      textColor: "#1B2A4A",
      fontFamily: "Georgia, serif",
      envelopeBg: "#1B2A4A",
    },
  },

  // ── QIZ BAZMI TEMPLATES ─────────────────────────────────────
  {
    slug: "qizlar-bazmi",
    name: "Qizlar bazmi",
    nameRu: "Девичник",
    eventType: "BACHELORETTE",
    description: "Qizil va oltin peonlar, samolyot animatsiyasi — nozik qizlar bazmi uslubi",
    previewBg: "#B9223A",
    theme: {
      primaryColor: "#B9223A",
      secondaryColor: "#8E1A2C",
      accentColor: "#C8992C",
      bgColor: "#FBF4E8",
      textColor: "#3A2A22",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      envelopeBg: "#B9223A",
    },
  },

  // ── TUG'ILGAN KUN TEMPLATE (self-contained) ─────────────────
  {
    slug: "tugilgan-kun",
    name: "Tug'ilgan kun",
    nameRu: "День рождения",
    eventType: "BIRTHDAY",
    description:
      "Rang-barang sharlar va konfetti animatsiyasi — quvnoq tug'ilgan kun bazmi uslubi",
    previewBg: "#FF6B8A",
    theme: {
      primaryColor: "#FF6B8A",
      secondaryColor: "#E14E6E",
      accentColor: "#FFC94D",
      bgColor: "#FFF8F0",
      textColor: "#3A2A3A",
      fontFamily: "'Quicksand', system-ui, sans-serif",
      envelopeBg: "#FF6B8A",
    },
  },
];

export function getTemplate(slug: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function themeToCssVars(theme: InvitationTheme): string {
  return `
    --primary: ${theme.primaryColor};
    --secondary: ${theme.secondaryColor};
    --accent: ${theme.accentColor};
    --bg: ${theme.bgColor};
    --text: ${theme.textColor};
    --font: ${theme.fontFamily};
    --envelope-bg: ${theme.envelopeBg};
  `.trim();
}
