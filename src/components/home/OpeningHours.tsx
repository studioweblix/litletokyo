import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { OpeningHour, StoreSettings } from "@/types";

const GERMAN_DAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;

// Mapping englischer und kurzer Tagnamen → deutsches Label
const DAY_NAME_MAP: Record<string, string> = {
  monday:    "Montag",
  tuesday:   "Dienstag",
  wednesday: "Mittwoch",
  thursday:  "Donnerstag",
  friday:    "Freitag",
  saturday:  "Samstag",
  sunday:    "Sonntag",
  mon:       "Montag",
  tue:       "Dienstag",
  wed:       "Mittwoch",
  thu:       "Donnerstag",
  fri:       "Freitag",
  sat:       "Samstag",
  sun:       "Sonntag",
  // Bereits deutsch → durchreichen
  montag:    "Montag",
  dienstag:  "Dienstag",
  mittwoch:  "Mittwoch",
  donnerstag:"Donnerstag",
  freitag:   "Freitag",
  samstag:   "Samstag",
  sonntag:   "Sonntag",
};

const DAY_ORDER = [
  "Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag",
];

function toGermanDay(raw: string): string {
  return DAY_NAME_MAP[raw.toLowerCase()] ?? raw;
}

function getTodayName(): string {
  return GERMAN_DAYS[new Date().getDay()];
}

function formatTimes(times: { open: string; close: string }[]): string {
  if (!times.length) return "Ruhetag";
  return times.map((t) => `${t.open} – ${t.close}`).join(" & ");
}

/** Parst alle gängigen Formate, die ein Dashboard für Öffnungszeiten speichern könnte. */
function normalizeOpeningHours(
  raw: OpeningHour[] | Record<string, unknown> | null | undefined
): OpeningHour[] {
  if (!raw) return [];

  // ── Format A: Array mit { day, closed, times } ───────────────────────────
  if (Array.isArray(raw)) {
    const result: OpeningHour[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const r = item as Record<string, unknown>;

      const dayRaw = typeof r.day === "string" ? r.day : null;
      if (!dayRaw) continue;

      const day = toGermanDay(dayRaw);

      // Format A1: { day, closed, times: [{ open, close }] }
      if ("closed" in r) {
        const closed = Boolean(r.closed);
        const times = Array.isArray(r.times)
          ? (r.times as { open: string; close: string }[])
          : [];
        result.push({ day, closed, times });
        continue;
      }

      // Format A2: { day, open, close, is_closed? }
      if (typeof r.open === "string" && typeof r.close === "string") {
        const closed = Boolean(r.is_closed ?? r.closed ?? false);
        result.push({
          day,
          closed,
          times: closed ? [] : [{ open: r.open, close: r.close }],
        });
        continue;
      }

      // Format A3: { day, hours: "10:00-22:00" | [{ open, close }], closed? }
      if (typeof r.hours === "string") {
        const closed = Boolean(r.closed ?? r.is_closed ?? false);
        const parts = r.hours.split("-").map((s) => s.trim());
        const times =
          !closed && parts.length === 2
            ? [{ open: parts[0], close: parts[1] }]
            : [];
        result.push({ day, closed, times });
        continue;
      }
    }
    // In DB-Reihenfolge belassen, aber fehlende Tage anhängen
    return result.length ? result : [];
  }

  // ── Format B: Objekt { monday: { slots/times/open/close, closed? }, … } ─
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const result: OpeningHour[] = [];

    for (const key of Object.keys(obj)) {
      const day = toGermanDay(key);
      const val = obj[key];
      if (!val || typeof val !== "object") continue;
      const v = val as Record<string, unknown>;

      const closed = Boolean(v.closed ?? v.is_closed ?? false);

      // Dashboard-Format: { slots: [{ open, close }], closed }
      const slotsOrTimes =
        (Array.isArray(v.slots) ? v.slots : null) ??
        (Array.isArray(v.times) ? v.times : null);

      if (slotsOrTimes) {
        result.push({
          day,
          closed,
          times: closed ? [] : (slotsOrTimes as { open: string; close: string }[]),
        });
        continue;
      }

      // Unterobjekt hat open/close direkt
      if (typeof v.open === "string" && typeof v.close === "string") {
        result.push({
          day,
          closed,
          times: closed ? [] : [{ open: v.open, close: v.close }],
        });
        continue;
      }

      // Kein bekanntes Unterformat – als geschlossen behandeln
      result.push({ day, closed: true, times: [] });
    }

    // Nach Standard-Wochentag-Reihenfolge sortieren
    result.sort(
      (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
    );
    return result;
  }

  return [];
}

interface OpeningHoursProps {
  settings: StoreSettings | null;
  kicker?: string;
  title?: string;
  intro?: string;
  boxKicker?: string;
}

export function OpeningHours({
  settings,
  kicker = "Herzlich Willkommen",
  title = "Unsere Öffnungszeiten",
  intro = "Wir freuen uns auf Ihren Besuch. Genießen Sie unsere Küche zu den folgenden Zeiten.",
  boxKicker = "Für Sie da",
}: OpeningHoursProps) {
  const hours = normalizeOpeningHours(settings?.opening_hours ?? null);
  const todayName = getTodayName();

  return (
    <AnimatedSection
      animation="slideUp"
      as="section"
      className="relative overflow-hidden py-24 md:py-36 bg-[var(--color-dark-surface)]"
    >
      {/* Ghost: 時 (Zeit) – Wasserzeichen */}
      <div
        className="absolute -right-6 top-0 select-none pointer-events-none hidden lg:block leading-none"
        aria-hidden
      >
        <span
          className="block font-light text-white/[0.03]"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "clamp(10rem, 25vw, 28rem)",
            lineHeight: 0.9,
          }}
        >
          時
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Links: Heading + Intro */}
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="block h-[2px] w-7 bg-[var(--color-crimson)]" />
              {/* Kanji: 時 (Zeit) */}
              <span
                className="text-[var(--color-crimson)] leading-none"
                style={{
                  fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
                  fontSize: "1rem",
                }}
              >
                時
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)]">
                {kicker}
              </p>
            </div>

            <h2
              className="font-heading font-light uppercase text-white leading-[0.93]"
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>

            <div className="mt-7 mb-7 h-px w-16 bg-[var(--color-gold)]" />

            <p className="text-[0.9375rem] leading-[1.85] text-white/55" style={{ maxWidth: "44ch" }}>
              {intro}
            </p>

            <div className="mt-10">
              <Link
                href="/reservierung"
                className="group inline-flex items-center gap-3 border border-[var(--color-crimson)] px-7 py-[14px] font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-crimson)] transition-all duration-300 hover:bg-[var(--color-crimson)] hover:text-white"
              >
                Tisch reservieren
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Rechts: Tabelle */}
          <div>
            {hours.length === 0 ? (
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                Keine Öffnungszeiten hinterlegt.
              </p>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-white/35 mb-5">
                  {boxKicker}
                </p>
                <ul className="divide-y divide-white/8 border-t border-white/8">
                  {hours.map((row) => {
                    const isToday = row.day === todayName;
                    const isClosed = row.closed || !row.times?.length;
                    const timesText = isClosed
                      ? "Ruhetag"
                      : formatTimes(row.times ?? []);

                    return (
                      <li
                        key={row.day}
                        className={`flex items-baseline justify-between gap-4 py-[18px] ${
                          isToday ? "text-[var(--color-crimson)]" : ""
                        }`}
                      >
                        <span className={`text-[0.9rem] ${isToday ? "font-semibold" : "text-white/80"}`}>
                          {row.day}
                          {isToday && (
                            <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.3em] opacity-70">
                              Heute
                            </span>
                          )}
                        </span>
                        <span
                          className={`font-mono text-[11.5px] tabular-nums shrink-0 ${
                            isClosed ? "italic text-white/25" : isToday ? "" : "text-white/55"
                          }`}
                        >
                          {timesText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-b border-white/8" />
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
