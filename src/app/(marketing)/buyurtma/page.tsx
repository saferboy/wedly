import type { Metadata } from "next";
import OrderWizard from "@/components/order/OrderWizard";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Buyurtma berish — Wedly",
  description:
    "Taklifnomangiz uchun ma'lumotlarni kiriting — tadbir turi, ismlar, sana, manzil va musiqa.",
};

interface Props {
  searchParams: Promise<{ template?: string }>;
}

export default async function BuyurtmaPage({ searchParams }: Props) {
  const { template } = await searchParams;

  return <OrderWizard templates={TEMPLATES} initialTemplate={template ?? null} />;
}
