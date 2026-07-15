import { Pacifico, Fredoka, Quicksand } from "next/font/google";

// Pacifico — playful script for the name / headings (single weight)
export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

// Fredoka — rounded display for eyebrows, labels and countdown numbers
export const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

// Quicksand — clean rounded body font
export const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const tugilganKunFontVars = `${pacifico.variable} ${fredoka.variable} ${quicksand.variable}`;
