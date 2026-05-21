import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { StoreSettings } from "@/types";

const PLACEHOLDER_TEXT =
  'Hier erscheint Ihre Geschichte. Pflegen Sie den Inhalt in der Datenbank unter der Seite "about".';

interface AboutProps {
  tenantName: string | null;
  title: string | null;
  imageUrl: string | null;
  imageUrl2: string | null;
  text: string | null;
  settings: StoreSettings | null;
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--color-dark)] font-mono text-[10px] uppercase tracking-widest text-white/20">
      KEIN BILD
    </div>
  );
}

export function About({
  tenantName,
  title,
  imageUrl,
  imageUrl2,
  text,
  settings,
}: AboutProps) {
  const phone = settings?.phone ?? null;
  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : null;
  const displayTitle = title?.trim() || "Unsere Geschichte";

  return (
    <AnimatedSection
      animation="fadeIn"
      as="section"
      className="relative overflow-hidden bg-[var(--color-dark-card)]"
    >
      <div id="about" className="scroll-mt-24" aria-hidden />

      {/* Ghost: 味 (Geschmack) – atmosphärisches Wasserzeichen */}
      <div
        className="absolute top-0 right-0 select-none pointer-events-none hidden lg:block leading-none"
        aria-hidden
      >
        <span
          className="block font-light text-white/[0.03]"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "clamp(10rem, 24vw, 26rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}
        >
          味
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">

          {/* Bild-Seite */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <ImagePlaceholder />
              )}
              {/* Crimson-Linie links */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-crimson)] z-10" />
            </div>

            {/* Zweites Bild – klar abgesetzt, kein Chaos */}
            {imageUrl2 && (
              <div
                className="absolute -bottom-8 -right-4 w-[42%] aspect-[4/5] overflow-hidden hidden md:block"
                style={{ outline: "4px solid var(--color-dark-card)" }}
              >
                <Image
                  src={imageUrl2}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            )}
          </div>

          {/* Text-Seite */}
          <div className="lg:pl-4">
            {/* Kicker */}
            <div className="mb-7 flex items-center gap-3">
              <span className="block h-[2px] w-7 bg-[var(--color-crimson)]" />
              {/* Kanji: 味 (Geschmack/Stil) */}
              <span
                className="text-[var(--color-crimson)] leading-none"
                style={{
                  fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
                  fontSize: "1rem",
                }}
              >
                味
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)]">
                {tenantName ?? "Restaurant"}
              </p>
            </div>

            {/* Titel */}
            <h2
              className="font-heading font-light uppercase text-white leading-[0.93]"
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {displayTitle}
            </h2>

            {/* Gold-Linie */}
            <div className="mt-7 mb-7 h-px w-16 bg-[var(--color-gold)]" />

            {/* Body */}
            <div
              className="text-[0.9375rem] leading-[1.85] text-white/58"
              style={{ maxWidth: "50ch" }}
            >
              {text ? (
                <p className="whitespace-pre-line">{text}</p>
              ) : (
                <p className="italic text-white/28">{PLACEHOLDER_TEXT}</p>
              )}
            </div>

            {/* Telefon */}
            {telHref && (
              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/35 mb-2">
                  Reservierung
                </p>
                <a
                  href={telHref}
                  className="font-heading font-light text-[var(--color-gold)] transition-opacity hover:opacity-75"
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                  }}
                >
                  {phone}
                </a>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="/ueber-uns"
                className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/45 transition-all hover:text-white"
              >
                Mehr über uns
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
