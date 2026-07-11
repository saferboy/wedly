import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin");

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { template: { include: { package: true } }, invitation: true },
  });

  if (!order) notFound();

  const rows: [string, string | null | undefined][] = [
    ["Tur", order.eventType === "WEDDING" ? "💍 To'y" : "🌸 Qiz bazmi"],
    ["Kuyov", order.groomName],
    ["Kelin", order.brideName],
    ["Sana", order.eventDate ? formatDate(order.eventDate, "uz") : null],
    ["Soat", order.eventTime],
    ["To'yxona", order.venueName],
    ["Manzil", order.venueAddress],
    ["Yandex link", order.yandexLink],
    ["Google link", order.googleLink],
    ["Musiqa", order.musicChoice],
    ["Karta", order.cardNumber],
    ["Karta egasi", order.cardHolder],
    ["Template", order.template?.name],
    ["Paket", order.template?.package?.name],
    ["Izoh", order.notes],
    ["Telegram", order.telegramUsername ? `@${order.telegramUsername}` : order.telegramChatId],
    ["Buyurtma vaqti", formatDate(order.createdAt, "uz")],
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm">
          ← Orqaga
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Buyurtma #{id.slice(-6).toUpperCase()}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ma'lumotlar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Ma'lumotlar</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {rows.map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</dt>
                    <dd className="text-sm text-gray-900 dark:text-white font-medium break-all">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>

          {/* To'lov screenshoti */}
          {order.paymentScreenshotUrl && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">To'lov cheki</h2>
              <Image
                src={order.paymentScreenshotUrl}
                alt="To'lov cheki"
                width={400}
                height={300}
                className="rounded-lg border border-gray-100 dark:border-gray-800 max-w-full"
              />
            </div>
          )}
        </div>

        {/* Amallar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Holat</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>

          {order.invitation ? (
            <div className="bg-green-50 rounded-xl border border-green-100 dark:bg-green-900/20 dark:border-green-900/40 p-6 space-y-3">
              <h2 className="font-semibold text-green-800 dark:text-green-300 mb-2">Taklif tayyor ✓</h2>
              <Link
                href={`/i/${order.invitation.slug}`}
                target="_blank"
                className="text-sm text-green-700 dark:text-green-400 underline break-all block"
              >
                /i/{order.invitation.slug}
              </Link>
              {order.template?.package?.hasPdfExport && (
                <a
                  href={`/api/orders/${order.id}/pdf`}
                  download
                  className="block w-full py-2.5 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900/40 text-green-800 dark:text-green-300 text-sm font-semibold text-center rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                >
                  PDF yuklab olish
                </a>
              )}
            </div>
          ) : (
            <Link
              href={`/admin/create?orderId=${order.id}`}
              className="block w-full py-3 bg-[#8B1A1A] text-white text-sm font-semibold text-center rounded-xl hover:bg-[#6B0F0F] transition-colors"
            >
              + Taklif yaratish
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
