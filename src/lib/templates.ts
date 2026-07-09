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
    slug: "floral-pink",
    name: "Floral",
    nameRu: "Флорал",
    eventType: "BACHELORETTE",
    description: "Pushti va gul bezaklari — nozik qizlar uslubi",
    previewBg: "#C2185B",
    theme: {
      primaryColor: "#C2185B",
      secondaryColor: "#AD1457",
      accentColor: "#F48FB1",
      bgColor: "#FFF5F8",
      textColor: "#880E4F",
      fontFamily: "Georgia, serif",
      envelopeBg: "#C2185B",
    },
  },
  {
    slug: "elegant-gold",
    name: "Elegant",
    nameRu: "Элегант",
    eventType: "BACHELORETTE",
    description: "Limon sariq va oltin — nozik elegantlik",
    previewBg: "#4A3728",
    theme: {
      primaryColor: "#4A3728",
      secondaryColor: "#3A2A1E",
      accentColor: "#D4AF37",
      bgColor: "#FFFDF5",
      textColor: "#4A3728",
      fontFamily: "Georgia, serif",
      envelopeBg: "#4A3728",
    },
  },
  {
    slug: "fun-purple",
    name: "Fun",
    nameRu: "Фан",
    eventType: "BACHELORETTE",
    description: "Binafsha va rangli — quvnoq zamonaviy uslub",
    previewBg: "#6A1B9A",
    theme: {
      primaryColor: "#6A1B9A",
      secondaryColor: "#4A148C",
      accentColor: "#E040FB",
      bgColor: "#FAF5FF",
      textColor: "#4A148C",
      fontFamily: "Georgia, serif",
      envelopeBg: "#6A1B9A",
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
