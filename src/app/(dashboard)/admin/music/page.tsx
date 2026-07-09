import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import MusicManager from "@/components/admin/MusicManager";

export default async function MusicPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const tracks = await db.musicTrack.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Musiqa kutubxonasi</h1>
      <MusicManager tracks={tracks} />
    </div>
  );
}
