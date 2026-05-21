"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Wine,
  Cake,
  Beef,
  Salad,
  Cherry,
  Soup,
  Fish,
  CookingPot,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatedSection,
  AnimatedStagger,
} from "@/components/ui/AnimatedSection";
import type { Category } from "@/types";

const SLUG_ICON_MAP: Record<string, LucideIcon> = {
  vorspeisen: Salad,
  hauptgerichte: Beef,
  beilagen: CookingPot,
  desserts: Cake,
  nachspeisen: Cake,
  getraenke: Coffee,
  weine: Wine,
  cocktails: Wine,
  suppen: Soup,
  fisch: Fish,
  wild: Beef,
  spezialitaeten: Cherry,
};

function iconForSlug(slug: string): LucideIcon {
  const normalized = slug
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
  for (const [key, icon] of Object.entries(SLUG_ICON_MAP)) {
    if (normalized.includes(key)) return icon;
  }
  return UtensilsCrossed;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface HighlightsProps {
  categories: Category[];
  kicker?: string;
  title?: string;
}

export function Highlights({
  categories,
  kicker = "Kulinarische Vielfalt",
  title = "Unsere Highlights",
}: HighlightsProps) {
  if (categories.length === 0) return null;

  return (
    <AnimatedSection
      animation="fadeIn"
      as="section"
      className="relative overflow-hidden py-24 md:py-32 bg-[var(--color-cream)]"
    >
      {/* Ghost: 食 – Wasserzeichen auf Creme-Hintergrund */}
      <div
        className="absolute -right-8 top-0 select-none pointer-events-none hidden lg:block leading-none"
        aria-hidden
      >
        <span
          className="block font-light"
          style={{
            fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
            fontSize: "clamp(12rem, 28vw, 30rem)",
            color: "var(--color-crimson)",
            opacity: 0.055,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
          }}
        >
          食
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Header – zentriert, dunkler Text auf hellem Grund */}
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[var(--color-crimson)]/40" />
            {/* Kanji-Symbol: 食 (Speise) */}
            <span
              className="text-[var(--color-crimson)]"
              style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              食
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-crimson)]">
              {kicker}
            </p>
            <span
              className="text-[var(--color-crimson)]"
              style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              食
            </span>
            <span className="h-px w-10 bg-[var(--color-crimson)]/40" />
          </div>
          <h2
            className="font-heading font-light uppercase leading-none text-[var(--color-text-dark)]"
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
          <div className="mt-5 h-px w-14 bg-[var(--color-gold)] mx-auto" />
        </div>

        {/* Card-Grid */}
        <AnimatedStagger
          as="div"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => {
            const Icon = iconForSlug(cat.slug);
            return (
              <motion.div key={cat.id} variants={cardVariants}>
                <Link
                  href={`/speisekarte#${cat.slug}`}
                  className="group relative flex flex-col items-center gap-6 overflow-hidden bg-[var(--color-crimson)] px-8 py-12 text-center transition-all duration-300 hover:bg-[var(--color-crimson-deep)] hover:shadow-2xl hover:shadow-[var(--color-crimson)]/30 hover:-translate-y-1"
                >
                  {/* Animierte Toplinie beim Hover (Gold) */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-gold)] scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10 transition-all duration-300 group-hover:border-[var(--color-gold)]/60 group-hover:bg-white/15">
                    <Icon
                      className="h-7 w-7 text-white transition-colors duration-300 group-hover:text-[var(--color-gold)]"
                      strokeWidth={1.25}
                    />
                  </div>

                  {/* Name */}
                  <h3
                    className="font-heading font-light uppercase text-white leading-none"
                    style={{
                      fontFamily: "var(--font-heading), serif",
                      fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {cat.name}
                  </h3>

                  {/* Arrow */}
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50 transition-all duration-300 group-hover:text-[var(--color-gold)] group-hover:tracking-[0.6em]">
                    Entdecken
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatedStagger>

        {/* Speisekarte CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/speisekarte"
            className="group inline-flex items-center gap-3 border border-[var(--color-crimson)] px-10 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-crimson)] transition-all duration-300 hover:bg-[var(--color-crimson)] hover:text-white"
          >
            Vollständige Speisekarte
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
