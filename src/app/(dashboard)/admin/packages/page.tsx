import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import PackageManager from "@/components/admin/PackageManager";

export default async function PackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const [packages, templates] = await Promise.all([
    db.package.findMany({
      include: { templates: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.template.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paketlar</h1>
      <PackageManager packages={packages} templates={templates} />
    </div>
  );
}
