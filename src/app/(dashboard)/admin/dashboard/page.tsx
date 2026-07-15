import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const STATUS_META: Record<string, { label: string; barColor: string; textColor: string }> = {
  PENDING:    { label: "Kutilmoqda",     barColor: "bg-yellow-400 dark:bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300" },
  PAID:       { label: "To'langan",      barColor: "bg-blue-400 dark:bg-blue-500",     textColor: "text-blue-700 dark:text-blue-300" },
  PROCESSING: { label: "Tayyorlanmoqda", barColor: "bg-purple-400 dark:bg-purple-500", textColor: "text-purple-700 dark:text-purple-300" },
  COMPLETED:  { label: "Tayyor",         barColor: "bg-green-400 dark:bg-green-500",   textColor: "text-green-700 dark:text-green-300" },
  CANCELLED:  { label: "Bekor qilindi",  barColor: "bg-red-400 dark:bg-red-500",       textColor: "text-red-700 dark:text-red-300" },
};

const STATUS_ORDER = ["PENDING", "PAID", "PROCESSING", "COMPLETED", "CANCELLED"];

function Bar({ label, value, max, barColor, textColor }: { label: string; value: number; max: number; barColor: string; textColor: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="w-32 shrink-0 text-sm text-gray-600 dark:text-gray-400 truncate">{label}</p>
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.max(pct, value > 0 ? 3 : 0)}%` }}
        />
      </div>
      <p className={`w-8 shrink-0 text-right text-sm font-semibold ${textColor}`}>{value}</p>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const [orders, invitations, musicTrackCount] = await Promise.all([
    db.order.findMany({ include: { template: true }, orderBy: { createdAt: "desc" } }),
    db.invitation.findMany(),
    db.musicTrack.count({ where: { isActive: true } }),
  ]);

  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const weddingCount = orders.filter((o) => o.eventType === "WEDDING").length;
  const bacheloretteCount = orders.filter((o) => o.eventType === "BACHELORETTE").length;
  const birthdayCount = orders.filter((o) => o.eventType === "BIRTHDAY").length;
  const maxEventTypeCount = Math.max(1, weddingCount, bacheloretteCount, birthdayCount);

  const templateCounts = new Map<string, number>();
  for (const o of orders) {
    if (o.template) templateCounts.set(o.template.name, (templateCounts.get(o.template.name) ?? 0) + 1);
  }
  const topTemplates = [...templateCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxTemplateCount = Math.max(1, ...topTemplates.map(([, c]) => c));

  const activeInvitations = invitations.filter((i) => i.isActive).length;
  const totalViews = invitations.reduce((sum, i) => sum + i.viewCount, 0);
  const needsAction = statusCounts.find((s) => s.status === "PENDING")!.count + statusCounts.find((s) => s.status === "PAID")!.count;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {/* KPI qatori */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatTile label="Jami buyurtmalar" value={orders.length} />
        <StatTile label="Faol takliflar" value={activeInvitations} />
        <StatTile label="Jami ko'rishlar" value={totalViews} />
        <StatTile label="Diqqat talab qiladi" value={needsAction} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Holat bo'yicha */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Buyurtmalar holati</h2>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <Bar
                key={status}
                label={STATUS_META[status].label}
                value={count}
                max={maxStatusCount}
                barColor={STATUS_META[status].barColor}
                textColor={STATUS_META[status].textColor}
              />
            ))}
          </div>
        </div>

        {/* Tadbir turi */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Tadbir turi</h2>
          <div className="space-y-3">
            <Bar
              label="To'y"
              value={weddingCount}
              max={maxEventTypeCount}
              barColor="bg-[#8B1A1A]"
              textColor="text-[#8B1A1A] dark:text-red-400"
            />
            <Bar
              label="Qiz bazmi"
              value={bacheloretteCount}
              max={maxEventTypeCount}
              barColor="bg-[#C9A84C]"
              textColor="text-[#8B6914] dark:text-[#C9A84C]"
            />
            <Bar
              label="Tug'ilgan kun"
              value={birthdayCount}
              max={maxEventTypeCount}
              barColor="bg-[#3ECFB0]"
              textColor="text-[#1a8f78] dark:text-[#3ECFB0]"
            />
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Musiqa kutubxonasi</span>
            <span className="font-semibold text-gray-900 dark:text-white">{musicTrackCount} trek</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Template mashhurligi */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Eng mashhur templatelar</h2>
          {topTemplates.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Hali ma'lumot yo'q</p>
          ) : (
            <div className="space-y-3">
              {topTemplates.map(([name, count]) => (
                <Bar
                  key={name}
                  label={name}
                  value={count}
                  max={maxTemplateCount}
                  barColor="bg-[#8B1A1A] dark:bg-red-500"
                  textColor="text-gray-700 dark:text-gray-300"
                />
              ))}
            </div>
          )}
        </div>

        {/* So'nggi buyurtmalar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">So'nggi buyurtmalar</h2>
            <Link href="/admin/orders" className="text-xs text-[#8B1A1A] dark:text-red-400 font-medium hover:underline">
              Barchasi →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Hali buyurtma yo'q</p>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {order.groomName ? `${order.groomName} & ${order.brideName}` : order.brideName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(order.createdAt, "uz")}</p>
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${STATUS_META[order.status].textColor}`}>
                      {STATUS_META[order.status].label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
