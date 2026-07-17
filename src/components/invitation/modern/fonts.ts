import { Bodoni_Moda, Jost } from "next/font/google";

// Bodoni Moda — high-contrast fashion serif for the display headings & names
export const bodoni = Bodoni_Moda({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

// Jost — clean geometric sans for labels & body
export const jost = Jost({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const modernFontVars = `${bodoni.variable} ${jost.variable}`;
