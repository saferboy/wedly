import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { TEMPLATES } from "../src/lib/templates";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seed boshlandi...");

  // Default paketlar
  const packages = [
    {
      slug: "oddiy",
      name: "Oddiy",
      price: 79000,
      description: "To'y yoki qiz bazmi uchun",
      hasPdfExport: false,
      isFeatured: false,
      sortOrder: 0,
      features: [
        "6 ta seksiya (konvert, ismlar, xat, sana, manzil, timer)",
        "1 ta template tanlash",
        "UZ / RU til qo'llab-quvvatlash",
        "Fon musiqasi",
        "30 kun faol",
        "Yandex va Google xaritasi",
      ],
    },
    {
      slug: "premium",
      name: "Premium",
      price: 149000,
      description: "Eng ko'p tanlangan",
      hasPdfExport: true,
      isFeatured: true,
      sortOrder: 1,
      features: [
        "Oddiy paketning barcha imkoniyatlari",
        "PDF eksport (chop etib qog'ozga chiqarish uchun)",
        "To'yxona rasmi va o'z musiqangizni yuklash",
        "90 kun faol",
        "Tezkor tayyorlash (12 soat)",
      ],
    },
  ];

  for (const p of packages) {
    await db.package.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        description: p.description,
        hasPdfExport: p.hasPdfExport,
        isFeatured: p.isFeatured,
        sortOrder: p.sortOrder,
        features: p.features,
      },
      create: p,
    });
    console.log(`✓ Paket: ${p.name}`);
  }

  // Templatelarni DB ga kiritish (paketga bog'lab)
  for (const t of TEMPLATES) {
    await db.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        eventType: t.eventType,
        previewImage: "",
        description: t.description,
        isActive: true,
        package: { connect: { slug: t.packageSlug } },
      },
      create: {
        slug: t.slug,
        name: t.name,
        eventType: t.eventType,
        previewImage: "",
        description: t.description,
        isActive: true,
        sortOrder: TEMPLATES.indexOf(t),
        package: { connect: { slug: t.packageSlug } },
      },
    });
    console.log(`✓ Template: ${t.name}`);
  }

  console.log("Seed tugadi!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
