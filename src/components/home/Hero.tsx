import Image from "next/image";
import Link from "next/link";
import { HeroScrollIndicator } from "./HeroScrollIndicator";

interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
  heroCta?: string;
}

export function Hero({
  heroTitle,
  heroSubtitle,
  heroImage,
  heroCta = "Unsere Speisekarte",
}: HeroProps) {
  const titleOneLine = heroTitle.replace(/\s*\n+\s*/g, " ").trim();

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">

      {/* Hintergrund */}
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            quality={92}
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-dark-card)]" />
        )}
        {/* Warmer, rötlich getönter Overlay – von links nach rechts abklingend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#110805]/95 via-[#1C0C08]/72 to-[#110805]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110805]/80 via-transparent to-black/20" />
      </div>

      {/* Crimson-Streifen: linke Kante */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-crimson)] z-10" aria-hidden />

      {/* Ghost: 東京 – großes Hintergrund-Wasserzeichen */}
      <div
        className="absolute bottom-0 right-2 z-[5] hidden lg:block select-none pointer-events-none leading-none"
        aria-hidden
      >
        <span
          className="block text-white/[0.03] font-light"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "clamp(9rem, 21vw, 21rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          東京
        </span>
      </div>

      {/* Vertikaler Text rechts – Desktop */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4"
        aria-hidden
      >
        <span className="h-20 w-px bg-[var(--color-gold)]/35" />
        {/* Kleines Kanji: 食 (Speise) */}
        <span
          className="text-[var(--color-gold)]/55"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "0.9rem",
          }}
        >
          食
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/30"
          style={{ writingMode: "vertical-rl" }}
        >
          {heroSubtitle}
        </span>
        {/* 桜 = Kirschblüte / Sakura */}
        <span
          className="text-[var(--color-crimson)]/55"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "0.9rem",
          }}
        >
          桜
        </span>
        <span className="h-20 w-px bg-[var(--color-crimson)]/35" />
      </div>

      {/* Content – links-unten */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-24 pl-10 pr-6 sm:pl-16 lg:pl-24">
        <div className="max-w-4xl">

          {/* Kicker */}
          <div className="mb-6 flex items-center gap-4">
            <span className="block h-[2px] w-7 bg-[var(--color-crimson)]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-crimson)]">
              {heroSubtitle}
            </p>
          </div>

          {/* Haupttitel */}
          <h1
            className="font-heading font-light uppercase text-white leading-[0.9]"
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(3.5rem, 10.5vw, 10rem)",
              letterSpacing: "-0.025em",
            }}
          >
            {titleOneLine}
          </h1>

          {/* Gold-Linie als Trenner */}
          <div className="mt-8 h-px w-20 bg-[var(--color-gold)]" />

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/speisekarte"
              className="group inline-flex items-center gap-3 bg-[var(--color-crimson)] px-8 py-[14px] font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-[var(--color-crimson-deep)]"
            >
              {heroCta}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/reservierung"
              className="group inline-flex items-center gap-3 border border-white/35 px-8 py-[14px] font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75 transition-all duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              Tisch reservieren
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      <HeroScrollIndicator />
    </section>
  );
}
