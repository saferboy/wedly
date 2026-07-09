import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import CreateInvitationForm from "@/components/admin/CreateInvitationForm";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CreatePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const { orderId } = await searchParams;

  const order = orderId
    ? await db.order.findUnique({ where: { id: orderId } })
    : null;

  const musicTracks = await db.musicTrack.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {order ? "Buyurtmaga taklif yaratish" : "Yangi taklif yaratish"}
      </h1>

      <CreateInvitationForm
        order={order}
        templates={TEMPLATES}
        musicTracks={musicTracks}
      />
    </div>
  );
}
