import { Cormorant_Garamond, Marcellus } from "next/font/google";

// Cormorant Garamond — the elegant letterpress serif used for names & headings
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

// Marcellus — refined uppercase labels (eyebrows, family, holder)
export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

export const classicFontVars = `${cormorant.variable} ${marcellus.variable}`;
