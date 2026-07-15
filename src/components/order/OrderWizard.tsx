"use client";

import { useMemo, useState } from "react";
import type { TemplateConfig } from "@/lib/templates";
import type { EventType } from "@/types/invitation";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";
import { songsFor, findSong } from "@/lib/songs";
import styles from "./OrderWizard.module.css";

interface Props {
  templates: TemplateConfig[];
  initialTemplate: string | null;
}

interface FormState {
  eventType: EventType;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  familyName: string;
  language: "uz" | "ru";
  templateSlug: string;
  venueName: string;
  venueAddress: string;
  yandexLink: string;
  googleLink: string;
  letterText: string;
  letterTextRu: string;
  song: string; // qo'shiq id yoki "none"
  cardNumber: string;
  cardHolder: string;
  notes: string;
}

const EVENT_OPTIONS: { value: EventType; label: string }[] = [
  { value: "WEDDING", label: "To'y" },
  { value: "BACHELORETTE", label: "Qiz bazmi" },
  { value: "BIRTHDAY", label: "Tug'ilgan kun" },
];

const STEPS = [
  { title: "Ismlar", sub: "Tadbir, ismlar va til" },
  { title: "Dizayn", sub: "Taklifnoma shabloni" },
  { title: "Manzil", sub: "To'yxona va joylashuv" },
  { title: "Matn va musiqa", sub: "Taklif xati va fon musiqasi" },
  { title: "Qo'shimcha", sub: "To'yona karta va izohlar" },
  { title: "Tekshirish", sub: "Ma'lumotlarni tasdiqlang" },
];

export default function OrderWizard({ templates, initialTemplate }: Props) {
  const initialTpl = initialTemplate
    ? templates.find((t) => t.slug === initialTemplate)
    : undefined;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    eventType: initialTpl?.eventType ?? "WEDDING",
    groomName: "",
    brideName: "",
    eventDate: "",
    eventTime: "",
    familyName: "",
    language: "uz",
    templateSlug: initialTpl?.slug ?? "",
    venueName: "",
    venueAddress: "",
    yandexLink: "",
    googleLink: "",
    letterText: "",
    letterTextRu: "",
    song: songsFor(initialTpl?.eventType ?? "WEDDING")[0]?.id ?? "none",
    cardNumber: "",
    cardHolder: "",
    notes: "",
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isWedding = form.eventType === "WEDDING";

  const availableTemplates = useMemo(
    () => templates.filter((t) => t.eventType === form.eventType),
    [templates, form.eventType]
  );

  const availableSongs = useMemo(() => songsFor(form.eventType), [form.eventType]);

  // Tadbir turi o'zgarganda mos kelmagan shablon va qo'shiqni moslaymiz.
  const onEventType = (value: EventType) => {
    setForm((f) => {
      const keepTpl = templates.find(
        (t) => t.slug === f.templateSlug && t.eventType === value
      );
      const nextSongs = songsFor(value);
      const keepSong =
        f.song === "none" || nextSongs.some((s) => s.id === f.song)
          ? f.song
          : nextSongs[0]?.id ?? "none";
      return { ...f, eventType: value, templateSlug: keepTpl?.slug ?? "", song: keepSong };
    });
  };

  const stepValid = (i: number): boolean => {
    switch (i) {
      case 0:
        return !!form.brideName.trim() && !!form.eventDate && !!form.eventTime.trim();
      case 1:
        return !!form.templateSlug;
      case 2:
        return !!form.venueName.trim() && !!form.venueAddress.trim();
      default:
        return true;
    }
  };

  const canContinue = stepValid(step);
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (!canContinue) return;
    setError("");
    if (isLast) {
      submit();
    } else {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    const chosenSong = findSong(form.song);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: form.eventType,
          groomName: isWedding ? form.groomName : "",
          brideName: form.brideName,
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          familyName: form.familyName,
          language: form.language,
          templateSlug: form.templateSlug || null,
          venueName: form.venueName,
          venueAddress: form.venueAddress,
          yandexLink: form.yandexLink,
          googleLink: form.googleLink,
          letterText: form.letterText,
          letterTextRu: form.letterTextRu,
          musicChoice: chosenSong ? "custom" : "none",
          customMusicUrl: chosenSong?.url ?? "",
          cardNumber: form.cardNumber,
          cardHolder: form.cardHolder,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Xatolik yuz berdi");
      }
      const data = await res.json();
      setOrderId(data.id);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Muvaffaqiyatli yakun ekрани ──────────────────────────────
  if (orderId) {
    const tgLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=order_${orderId}`;
    return (
      <div className={styles.wizard}>
        <div className={styles.successWrap}>
          <div className={styles.successCard}>
            <div className={styles.successGlyph}>✓</div>
            <h1 className={styles.serif}>Buyurtma qabul qilindi!</h1>
            <p className={styles.successText}>
              Ma'lumotlaringiz saqlandi. To'lovni yakunlash va tayyor
              taklifnomangizni olish uchun Telegram botimizga o'ting — buyurtmangiz
              avtomatik biriktiriladi.
            </p>
            <a
              className={`${styles.btnPrimary} ${styles.tgBtn}`}
              href={tgLink}
              target="_blank"
              rel="noreferrer"
            >
              Telegramda to'lovni yakunlash →
            </a>
            <p className={styles.successHint}>
              Buyurtma raqami: <span>{orderId.slice(-8)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const meta = STEPS[step];

  return (
    <div className={styles.wizard}>
      {/* Progress */}
      <div className={styles.progressBar} aria-hidden>
        {STEPS.map((_, i) => (
          <span key={i} className={`${styles.seg} ${i <= step ? styles.on : ""}`} />
        ))}
      </div>

      <div className={styles.sheet}>
        <header className={styles.stepHead}>
          <h1 className={styles.serif}>{meta.title}</h1>
          <p className={styles.stepSub}>{meta.sub}</p>
        </header>

        <div className={styles.stepBody}>
          {step === 0 && (
            <>
              <Field label="Tadbir turi">
                <div className={styles.pills}>
                  {EVENT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={`${styles.pill} ${form.eventType === o.value ? styles.active : ""}`}
                      onClick={() => onEventType(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </Field>

              {isWedding && (
                <Field label="Kuyov">
                  <input
                    className={styles.inp}
                    value={form.groomName}
                    onChange={(e) => set("groomName", e.target.value)}
                    placeholder="Masalan: Otabek"
                  />
                </Field>
              )}

              <Field label={isWedding ? "Kelin" : "Ism"}>
                <input
                  className={styles.inp}
                  value={form.brideName}
                  onChange={(e) => set("brideName", e.target.value)}
                  placeholder={isWedding ? "Masalan: Kumush" : "Masalan: Diyora"}
                />
              </Field>

              <div className={styles.row2}>
                <Field label="Sana" required>
                  <input
                    className={styles.inp}
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => set("eventDate", e.target.value)}
                  />
                </Field>
                <Field label="Vaqt" required>
                  <input
                    className={styles.inp}
                    type="time"
                    value={form.eventTime}
                    onChange={(e) => set("eventTime", e.target.value)}
                  />
                </Field>
              </div>

              <div className={styles.row2}>
                <Field label="Oila nomi">
                  <input
                    className={styles.inp}
                    value={form.familyName}
                    onChange={(e) => set("familyName", e.target.value)}
                    placeholder="Masalan: Shomurodovlar oilasi"
                  />
                </Field>
                <Field label="Taklifnoma tili">
                  <select
                    className={styles.inp}
                    value={form.language}
                    onChange={(e) => set("language", e.target.value as "uz" | "ru")}
                  >
                    <option value="uz">O'zbek</option>
                    <option value="ru">Rus</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <Field label="Shablonni tanlang">
              {availableTemplates.length === 0 ? (
                <p className={styles.muted}>Bu tadbir turi uchun shablon topilmadi.</p>
              ) : (
                <div className={styles.tplGrid}>
                  {availableTemplates.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      className={`${styles.tplCard} ${form.templateSlug === t.slug ? styles.active : ""}`}
                      onClick={() => set("templateSlug", t.slug)}
                    >
                      <span className={styles.tplSwatch} style={{ background: t.previewBg }}>
                        <span className={styles.tplDot} style={{ background: t.theme.accentColor }} />
                      </span>
                      <span className={styles.tplName}>{t.name}</span>
                      <span className={styles.tplDesc}>{t.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )}

          {step === 2 && (
            <>
              <Field label="To'yxona nomi" required>
                <input
                  className={styles.inp}
                  value={form.venueName}
                  onChange={(e) => set("venueName", e.target.value)}
                  placeholder="Masalan: Oq Saroy Restaurant"
                />
              </Field>
              <Field label="Manzil" required>
                <input
                  className={styles.inp}
                  value={form.venueAddress}
                  onChange={(e) => set("venueAddress", e.target.value)}
                  placeholder="Masalan: S. Ayniy ko'chasi, 60, Toshkent"
                />
              </Field>
              <div className={styles.row2}>
                <Field label="Yandex Maps havolasi">
                  <input
                    className={styles.inp}
                    value={form.yandexLink}
                    onChange={(e) => set("yandexLink", e.target.value)}
                    placeholder="https://yandex.uz/maps/..."
                  />
                </Field>
                <Field label="Google Maps havolasi">
                  <input
                    className={styles.inp}
                    value={form.googleLink}
                    onChange={(e) => set("googleLink", e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Taklif xati (o'zbekcha)">
                <textarea
                  className={`${styles.inp} ${styles.area}`}
                  value={form.letterText}
                  onChange={(e) => set("letterText", e.target.value)}
                  placeholder="Aziz va qadrdon yaqinim! Sizni tantanamizga taklif qilamiz..."
                />
              </Field>
              <Field label="Taklif xati (ruscha) — ixtiyoriy">
                <textarea
                  className={`${styles.inp} ${styles.area}`}
                  value={form.letterTextRu}
                  onChange={(e) => set("letterTextRu", e.target.value)}
                  placeholder="Дорогой и близкий мне человек! ..."
                />
              </Field>

              <Field label="Fon musiqasi">
                <div className={styles.songList}>
                  {availableSongs.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.songRow} ${form.song === s.id ? styles.active : ""}`}
                      onClick={() => set("song", s.id)}
                    >
                      <span className={styles.songRadio} />
                      <span className={styles.songMeta}>
                        <span className={styles.songTitle}>{s.title}</span>
                        <span className={styles.songSub}>{s.sub}</span>
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.songRow} ${form.song === "none" ? styles.active : ""}`}
                    onClick={() => set("song", "none")}
                  >
                    <span className={styles.songRadio} />
                    <span className={styles.songMeta}>
                      <span className={styles.songTitle}>Musiqa yo'q</span>
                      <span className={styles.songSub}>Taklifnoma jimjit bo'ladi</span>
                    </span>
                  </button>
                </div>
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <p className={`${styles.muted} ${styles.mb}`}>
                To'yona uchun karta raqamingizni qo'shsangiz, mehmonlar
                taklifnomadan ko'chirib olishlari mumkin. (Ixtiyoriy)
              </p>
              <div className={styles.row2}>
                <Field label="Karta raqami">
                  <input
                    className={styles.inp}
                    value={form.cardNumber}
                    onChange={(e) => set("cardNumber", e.target.value)}
                    placeholder="8600 0000 0000 0000"
                  />
                </Field>
                <Field label="Karta egasi">
                  <input
                    className={styles.inp}
                    value={form.cardHolder}
                    onChange={(e) => set("cardHolder", e.target.value.toUpperCase())}
                    placeholder="OTABEK SHOMURODOV"
                  />
                </Field>
              </div>
              <Field label="Qo'shimcha izoh">
                <textarea
                  className={`${styles.inp} ${styles.area}`}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Alohida xohishlaringiz bo'lsa yozib qoldiring..."
                />
              </Field>
            </>
          )}

          {step === 5 && (
            <div className={styles.review}>
              <ReviewRow label="Tadbir" value={EVENT_OPTIONS.find((o) => o.value === form.eventType)?.label} />
              {isWedding && <ReviewRow label="Kuyov" value={form.groomName} />}
              <ReviewRow label={isWedding ? "Kelin" : "Ism"} value={form.brideName} />
              <ReviewRow label="Sana" value={`${form.eventDate} ${form.eventTime}`} />
              <ReviewRow label="Oila nomi" value={form.familyName} />
              <ReviewRow label="Til" value={form.language === "uz" ? "O'zbek" : "Rus"} />
              <ReviewRow
                label="Shablon"
                value={templates.find((t) => t.slug === form.templateSlug)?.name}
              />
              <ReviewRow label="To'yxona" value={form.venueName} />
              <ReviewRow label="Manzil" value={form.venueAddress} />
              <ReviewRow
                label="Musiqa"
                value={findSong(form.song)?.title ?? "Yo'q"}
              />
              {form.cardNumber && <ReviewRow label="Karta" value={form.cardNumber} />}
              <p className={`${styles.muted} ${styles.reviewNote}`}>
                Tasdiqlaganingizdan so'ng to'lov Telegram bot orqali yakunlanadi.
              </p>
            </div>
          )}
        </div>

        {error && <p className={styles.err}>{error}</p>}
      </div>

      {/* Footer navigatsiya */}
      <div className={styles.navBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={back}
          disabled={step === 0}
          aria-label="Orqaga"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.btnPrimary} ${styles.continueBtn}`}
          onClick={next}
          disabled={!canContinue || submitting}
        >
          {submitting ? "Yuborilmoqda..." : isLast ? "Buyurtma berish →" : "Davom etish →"}
        </button>
      </div>
    </div>
  );
}

// ── Kichik yordamchi komponentlar (modul darajasida — input fokusi
//    yo'qolmasligi uchun komponent ichida e'lon qilinmaydi) ────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </span>
      {children}
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value}</span>
    </div>
  );
}
