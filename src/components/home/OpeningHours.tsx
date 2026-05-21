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

function getTodayName(): string {
  return GERMAN_DAYS[new Date().getDay()];
}

function formatTimes(times: { open: string; close: string }[]): string {
  if (!times.length) return "Ruhetag";
  return times.map((t) => `${t.open} – ${t.close}`).join(" & ");
}

function normalizeOpeningHours(
  raw: OpeningHour[] | Record<string, unknown> | null | undefined
): OpeningHour[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is OpeningHour =>
        item != null &&
        typeof item === "object" &&
        "day" in item &&
        "closed" in item
    );
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
