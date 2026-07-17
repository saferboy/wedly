"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package as PackageIcon, Trash2, Plus, Pencil, Check, X, Star } from "lucide-react";

interface Template {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  features: string[];
  hasPdfExport: boolean;
  isFeatured: boolean;
  isActive: boolean;
  templates: Template[];
}

interface Props {
  packages: Package[];
  templates: Template[];
}

const emptyForm = {
  name: "",
  slug: "",
  price: "",
  description: "",
  featuresText: "",
  hasPdfExport: false,
  isFeatured: false,
};

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("uz-UZ").format(price)} so'm`;
}

function splitFeatures(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function PackageManager({ packages, templates }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editTemplateIds, setEditTemplateIds] = useState<string[]>([]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        price: Number(form.price),
        description: form.description,
        hasPdfExport: form.hasPdfExport,
        isFeatured: form.isFeatured,
        features: splitFeatures(form.featuresText),
      }),
    });
    setForm(emptyForm);
    setAdding(false);
    setSaving(false);
    router.refresh();
  };

  const startEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setEditForm({
      name: pkg.name,
      slug: pkg.slug,
      price: String(pkg.price),
      description: pkg.description ?? "",
      featuresText: pkg.features.join("\n"),
      hasPdfExport: pkg.hasPdfExport,
      isFeatured: pkg.isFeatured,
    });
    setEditTemplateIds(pkg.templates.map((t) => t.id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditTemplateIds([]);
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    await fetch(`/api/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        slug: editForm.slug,
        price: Number(editForm.price),
        description: editForm.description,
        hasPdfExport: editForm.hasPdfExport,
        isFeatured: editForm.isFeatured,
        features: splitFeatures(editForm.featuresText),
        templateIds: editTemplateIds,
      }),
    });
    setSaving(false);
    cancelEdit();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu paketni o'chirasizmi? Unga bog'langan templatelar paketsiz qoladi.")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const toggleTemplate = (id: string) => {
    setEditTemplateIds((ids) =>
      ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]
    );
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500";
  const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="space-y-4">
      {/* Paket qo'shish */}
      {adding ? (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Yangi paket qo&apos;shish</h2>
          <div>
            <label className={labelClass}>Nomi *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Premium"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="premium"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Narx (so&apos;m) *</label>
            <input
              type="number"
              className={inputClass}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="149000"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Tavsif (homepage&apos;da narx ostida)</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Eng ko'p tanlangan"
            />
          </div>
          <div>
            <label className={labelClass}>Afzalliklar ro&apos;yxati (har birini alohida qatorga yozing)</label>
            <textarea
              className={`${inputClass} min-h-28`}
              value={form.featuresText}
              onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
              placeholder={"1 ta template tanlash\nUZ / RU til qo'llab-quvvatlash\n30 kun faol"}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.hasPdfExport}
              onChange={(e) => setForm((f) => ({ ...f, hasPdfExport: e.target.checked }))}
            />
            PDF eksport kiradi
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            />
            Homepage&apos;da &quot;ENG MASHHUR&quot; deb ajratilsin
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors disabled:opacity-50"
            >
              {saving ? "Saqlanmoqda..." : "Qo'shish"}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Bekor
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors"
        >
          <Plus size={16} />
          Paket qo&apos;shish
        </button>
      )}

      {/* Ro'yxat */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {packages.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <PackageIcon size={32} className="mx-auto mb-3 opacity-30" />
            <p>Paketlar yo&apos;q</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {packages.map((pkg) =>
              editingId === pkg.id ? (
                <li key={pkg.id} className="px-5 py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Nomi</label>
                      <input
                        className={inputClass}
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <input
                        className={inputClass}
                        value={editForm.slug}
                        onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Narx (so&apos;m)</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={editForm.price}
                        onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Tavsif</label>
                      <input
                        className={inputClass}
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Afzalliklar ro&apos;yxati (har biri alohida qatorda)</label>
                    <textarea
                      className={`${inputClass} min-h-28`}
                      value={editForm.featuresText}
                      onChange={(e) => setEditForm((f) => ({ ...f, featuresText: e.target.value }))}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editForm.hasPdfExport}
                      onChange={(e) => setEditForm((f) => ({ ...f, hasPdfExport: e.target.checked }))}
                    />
                    PDF eksport kiradi
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editForm.isFeatured}
                      onChange={(e) => setEditForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    />
                    Homepage&apos;da &quot;ENG MASHHUR&quot; deb ajratilsin
                  </label>

                  <div>
                    <p className={labelClass}>Ushbu paketga kiruvchi templatelar</p>
                    <div className="flex flex-wrap gap-3">
                      {templates.map((t) => (
                        <label
                          key={t.id}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <input
                            type="checkbox"
                            checked={editTemplateIds.includes(t.id)}
                            onChange={() => toggleTemplate(t.id)}
                          />
                          {t.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(pkg.id)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#8B1A1A] text-white text-sm rounded-lg hover:bg-[#6B0F0F] transition-colors disabled:opacity-50"
                    >
                      <Check size={16} />
                      Saqlash
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <X size={16} />
                      Bekor
                    </button>
                  </div>
                </li>
              ) : (
                <li
                  key={pkg.id}
                  className="flex flex-wrap items-center justify-between gap-y-2 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8B1A1A]/10 rounded-lg flex items-center justify-center">
                      <PackageIcon size={16} className="text-[#8B1A1A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        {pkg.name}
                        {pkg.isFeatured && (
                          <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
                        )}
                        {pkg.hasPdfExport && (
                          <span className="text-xs font-normal text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                            PDF
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatPrice(pkg.price)} · {pkg.templates.length} ta template · {pkg.features.length} ta afzallik
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(pkg)}
                      className="text-gray-300 hover:text-[#8B1A1A] dark:text-gray-600 dark:hover:text-[#C9A84C] transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
