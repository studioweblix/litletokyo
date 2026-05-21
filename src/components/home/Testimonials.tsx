"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

const AUTO_SCROLL_MS = 6500;

interface TestimonialsProps {
  testimonials: Testimonial[];
  backgroundImage: string | null;
  kicker?: string;
  title?: string;
}

function clampRating(rating: number) {
  return Math.min(5, Math.max(1, Math.round(rating)));
}

function Stars({ rating }: { rating: number }) {
  const n = clampRating(rating);
  return (
    <div className="flex gap-1.5" aria-label={`${n} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= n
              ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
              : "fill-transparent text-white/20"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function getSourceLabel(source: string): string {
  const s = source.trim().toLowerCase();
  if (s.includes("google")) return "Google Bewertung";
  if (s.includes("facebook")) return "Facebook Bewertung";
  return "Gästebewertung";
}

export function Testimonials({
  testimonials,
  backgroundImage,
  kicker = "Kundenstimmen",
  title = "Was sagen unsere Gäste?",
}: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = testimonials.length;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-28%", "28%"]);

  const goTo = useCallback(
    (next: number) => setIndex((next + len) % len),
    [len]
  );

  useEffect(() => {
    if (len <= 1 || paused) return;
    const id = setInterval(() => goTo(index + 1), AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [index, goTo, len, paused]);

  const item = len > 0 ? testimonials[index] : null;

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] flex items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Parallax Hintergrund */}
      {backgroundImage ? (
        <motion.div className="absolute inset-[-28%]" style={{ y }}>
          <Image
            src={backgroundImage}
            alt=""
            fill
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-[var(--color-dark-card)]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/72" />

      {/* Kleines Crimson Anführungszeichen – Dekor */}
      <span
        className="pointer-events-none select-none absolute top-10 left-8 sm:left-14 lg:left-20 font-heading font-light text-[var(--color-crimson)]/25 leading-none"
        style={{
          fontFamily: "var(--font-heading), serif",
          fontSize: "clamp(4rem, 9vw, 7rem)",
          lineHeight: 1,
        }}
        aria-hidden
      >
        &ldquo;
      </span>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-12 lg:px-20 py-24">

        {/* Kicker */}
        <div className="mb-8 flex items-center gap-4">
          <span className="block h-[2px] w-7 bg-[var(--color-crimson)]" />
          {/* Kanji: 幸 (Glück/Wohlbefinden) */}
          <span
            className="text-[var(--color-crimson)] leading-none"
            style={{
              fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
              fontSize: "1rem",
            }}
          >
            幸
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-crimson)]">
            {kicker}
          </p>
        </div>

        {/* Titel */}
        <h2
          className="font-heading font-light uppercase text-white leading-[0.93] mb-12"
          style={{
            fontFamily: "var(--font-heading), serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>

        {item ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Stars rating={item.rating} />

              <blockquote
                className="mt-6 text-white/82 leading-[1.75]"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.22rem)" }}
              >
                &ldquo;{item.text}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-8 bg-[var(--color-gold)]/55" />
                <div>
                  <cite className="not-italic font-mono text-[11px] uppercase tracking-[0.3em] text-white">
                    {item.author_name}
                  </cite>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-white/32">
                    {getSourceLabel(item.source)}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/28">
            Noch keine Bewertungen vorhanden.
          </p>
        )}

        {/* Crimson Dash-Navigation */}
        {len > 1 && (
          <div className="mt-12 flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Bewertung ${i + 1}`}
                className={`h-[2px] transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-[var(--color-crimson)]"
                    : "w-4 bg-white/22 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
