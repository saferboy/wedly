import { Fraunces, Jost } from "next/font/google";

// Fraunces — a soft modern display serif for names & headings
export const fraunces = Fraunces({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Jost — clean geometric sans for labels & body
export const jost = Jost({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const auroraFontVars = `${fraunces.variable} ${jost.variable}`;
