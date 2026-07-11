import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Browser } from "puppeteer-core";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { invitation: true, template: { include: { package: true } } },
  });

  if (!order?.invitation) {
    return NextResponse.json({ error: "Taklifnoma topilmadi" }, { status: 404 });
  }
  if (!order.template?.package?.hasPdfExport) {
    return NextResponse.json({ error: "Bu paketda PDF eksport mavjud emas" }, { status: 403 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pageUrl = `${baseUrl}/i/${order.invitation.slug}?print=1`;
  const isProd = process.env.VERCEL_ENV === "production";

  let browser: Browser | undefined;
  try {
    if (isProd) {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import("puppeteer");
      browser = (await puppeteer.launch({ headless: true })) as unknown as Browser;
    }

    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    return new NextResponse(new Blob([Buffer.from(pdf)], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${order.invitation.slug}.pdf"`,
      },
    });
  } finally {
    await browser?.close();
  }
}
