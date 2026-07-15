import { Great_Vibes, Cormorant_Garamond, Marcellus } from "next/font/google";

// Great Vibes — cursive display font for headings (single weight)
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

// Cormorant Garamond — body serif
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

// Marcellus — refined uppercase accents (eyebrows, pills, labels)
export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

export const qizlarBazmiFontVars = `${greatVibes.variable} ${cormorant.variable} ${marcellus.variable}`;
