"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "PENDING",    label: "Kutilmoqda",      color: "bg-yellow-100 text-yellow-700" },
  { value: "PAID",       label: "To'langan",        color: "bg-blue-100 text-blue-700" },
  { value: "PROCESSING", label: "Tayyorlanmoqda",   color: "bg-purple-100 text-purple-700" },
  { value: "COMPLETED",  label: "Tayyor",            color: "bg-green-100 text-green-700" },
  { value: "CANCELLED",  label: "Bekor qilindi",    color: "bg-red-100 text-red-700" },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const current = STATUSES.find((s) => s.value === status);

  const save = async (newStatus: string) => {
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <span className={`inline-block text-sm px-3 py-1.5 rounded-full font-medium ${current?.color}`}>
        {current?.label}
      </span>

      <select
        value={status}
        onChange={(e) => save(e.target.value)}
        disabled={saving}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {saving && <p className="text-xs text-gray-400">Saqlanmoqda...</p>}
    </div>
  );
}
