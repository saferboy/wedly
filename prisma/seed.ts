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

  // Templatelarni DB ga kiritish
  for (const t of TEMPLATES) {
    await db.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        eventType: t.eventType,
        previewImage: "",
        description: t.description,
        isActive: true,
      },
      create: {
        slug: t.slug,
        name: t.name,
        eventType: t.eventType,
        previewImage: "",
        description: t.description,
        isActive: true,
        sortOrder: TEMPLATES.indexOf(t),
      },
    });
    console.log(`✓ Template: ${t.name}`);
  }

  // Demo musiqa treklarini qo'shish
  const demoTracks = [
    { title: "Muhabbat", artist: "Ozodbek Nazarbekov", fileUrl: "/music/sample.mp3" },
    { title: "Sevgim", artist: "Shaxriyor", fileUrl: "/music/sample.mp3" },
    { title: "Qalbim", artist: "Ulugbek Rahmatullayev", fileUrl: "/music/sample.mp3" },
    { title: "Seni sevaman", artist: "Jasur Umirov", fileUrl: "/music/sample.mp3" },
  ];

  for (const track of demoTracks) {
    const existing = await db.musicTrack.findFirst({ where: { title: track.title } });
    if (!existing) {
      await db.musicTrack.create({ data: track });
      console.log(`✓ Musiqa: ${track.title}`);
    }
  }

  console.log("Seed tugadi!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
