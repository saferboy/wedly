import type { EventType, InvitationTheme } from "@/types/invitation";

export interface TemplateConfig {
  slug: string;
  name: string;
  nameRu: string;
  eventType: EventType;
  description: string;
  theme: InvitationTheme;
  previewBg: string;
  packageSlug: "oddiy" | "premium";
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
    packageSlug: "premium",
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

  // ── TO'Y — self-contained (letterpress classic) ─────────────
  {
    slug: "nikoh-classic",
    name: "Classic",
    nameRu: "Классик",
    eventType: "WEDDING",
    description:
      "Anor-qizil va oltin bosma nusxa, bir sahifali ramkali karta — an'anaviy nafis uslub",
    previewBg: "#7E1620",
    packageSlug: "premium",
    theme: {
      primaryColor: "#7E1620",
      secondaryColor: "#5C0F17",
      accentColor: "#B08D45",
      bgColor: "#FAF6EC",
      textColor: "#3A2318",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      envelopeBg: "#7E1620",
    },
  },

  // ── TO'Y — self-contained (airy modern minimalist) ──────────
  {
    slug: "nikoh-aurora",
    name: "Aurora",
    nameRu: "Аврора",
    eventType: "WEDDING",
    description:
      "Ochiq sut rangi, ko'mir siyoh va pushti-oltin — havodor zamonaviy minimalist uslub",
    previewBg: "#C0857A",
    packageSlug: "premium",
    theme: {
      primaryColor: "#C0857A",
      secondaryColor: "#A5675C",
      accentColor: "#C9A67C",
      bgColor: "#FBF6F1",
      textColor: "#2E2925",
      fontFamily: "'Fraunces', Georgia, serif",
      envelopeBg: "#C0857A",
    },
  },

  // ── TO'Y — self-contained (dark editorial, full-bleed photo) ─
  {
    slug: "nikoh-modern",
    name: "Modern",
    nameRu: "Модерн",
    eventType: "WEDDING",
    description:
      "Qora, oltin va butun ekranli fotosurat — zamonaviy, dramatik editorial uslub",
    previewBg: "#121012",
    packageSlug: "premium",
    theme: {
      primaryColor: "#121012",
      secondaryColor: "#1A171A",
      accentColor: "#C9A86A",
      bgColor: "#121012",
      textColor: "#ECE7E1",
      fontFamily: "'Bodoni Moda', Didot, Georgia, serif",
      envelopeBg: "#121012",
    },
  },

  // ── QIZ BAZMI TEMPLATE (self-contained) ─────────────────────
  {
    slug: "qizlar-bazmi",
    name: "Qizlar bazmi",
    nameRu: "Девичник",
    eventType: "BACHELORETTE",
    description: "Qizil va oltin peonlar, samolyot animatsiyasi — nozik qizlar bazmi uslubi",
    previewBg: "#B9223A",
    packageSlug: "oddiy",
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
    packageSlug: "premium",
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
