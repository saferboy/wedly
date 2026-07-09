import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSessionProvider from "@/components/admin/AdminSessionProvider";

export const metadata = { title: "Wedly Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <AdminSessionProvider session={session}>
      <div className="min-h-screen bg-gray-50 flex">
        {session && <AdminSidebar />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </AdminSessionProvider>
  );
}
