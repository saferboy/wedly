import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Kutilmoqda",    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
  PAID:       { label: "To'langan",     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  PROCESSING: { label: "Tayyorlanmoqda",color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  COMPLETED:  { label: "Tayyor",        color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  CANCELLED:  { label: "Bekor",         color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true },
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    paid: orders.filter((o) => o.status === "PAID").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buyurtmalar</h1>
        <Link
          href="/admin/create"
          className="px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors"
        >
          + Yangi taklif
        </Link>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Jami", value: stats.total, color: "text-gray-900 dark:text-white" },
          { label: "Yangi", value: stats.pending, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "To'langan", value: stats.paid, color: "text-blue-600 dark:text-blue-400" },
          { label: "Tayyor", value: stats.completed, color: "text-green-600 dark:text-green-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Jadval */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p>Hozircha buyurtma yo'q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                {["Mijoz", "Tur", "Kelin / To'y", "Sana", "Template", "Holat", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.map((order) => {
                const st = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.telegramUsername
                          ? `@${order.telegramUsername}`
                          : order.telegramChatId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {order.eventType === "WEDDING" ? "To'y" : "Qiz bazmi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 dark:text-white">
                        {order.groomName
                          ? `${order.groomName} & ${order.brideName}`
                          : order.brideName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {order.eventDate
                        ? formatDate(order.eventDate, "uz")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {order.template?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#8B1A1A] text-xs font-medium hover:underline"
                      >
                        Ko'rish →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
