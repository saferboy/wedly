import { Playfair_Display, Cormorant_Garamond, Marcellus, Great_Vibes } from "next/font/google";

// Playfair Display — elegant serif for section headings
export const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
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

// Great Vibes — flowing script for the couple's names
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const toyFontVars = `${playfair.variable} ${cormorant.variable} ${marcellus.variable} ${greatVibes.variable}`;
