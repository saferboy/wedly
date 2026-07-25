import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import FeedbackManager from "@/components/admin/FeedbackManager";

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const feedbacks = await db.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: { select: { brideName: true, groomName: true } } },
  });

  const unread = feedbacks.filter((f) => !f.isRead).length;

  const items = feedbacks.map((f) => ({
    id: f.id,
    name: f.name,
    phone: f.phone,
    message: f.message,
    isRead: f.isRead,
    createdAt: f.createdAt.toISOString(),
    orderName: f.order
      ? f.order.groomName
        ? `${f.order.groomName} & ${f.order.brideName}`
        : f.order.brideName
      : null,
  }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fikr va takliflar
        </h1>
        {unread > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#8B1A1A] text-white font-medium">
            {unread} yangi
          </span>
        )}
      </div>
      <FeedbackManager items={items} />
    </div>
  );
}
