import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Takliflar</h1>
        <Link
          href="/admin/create"
          className="px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors"
        >
          + Yangi
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {invitations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">🌹</p>
            <p>Hozircha taklif yo'q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                {["Slug", "Kelin / To'y", "Sana", "Template", "Ko'rishlar", "Holat", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {inv.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {inv.groomName
                      ? `${inv.groomName} & ${inv.brideName}`
                      : inv.brideName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(inv.eventDate, "uz")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {inv.template.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {inv.viewCount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        inv.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {inv.isActive ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/i/${inv.slug}`}
                      target="_blank"
                      className="text-[#8B1A1A] text-xs font-medium hover:underline mr-3"
                    >
                      Ko'rish →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
