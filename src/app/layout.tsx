import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedly — Onlayn to'y taklifnomalari",
  description:
    "To'y va qiz bazmi uchun chiroyli raqamli taklifnomalar. Template tanlang, buyurtma bering — 24 soat ichida tayyor.",
  keywords: "to'y taklifnoma, wedding invitation, qiz bazmi, onlayn taklif, uzbekistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
