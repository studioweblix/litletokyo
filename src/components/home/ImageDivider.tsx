"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageDividerProps {
  imageUrl: string | null;
}

export function ImageDivider({ imageUrl }: ImageDividerProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-28%", "28%"]);

  return (
    <section
      ref={ref}
      className="relative w-full h-[52vh] min-h-[300px] max-h-[500px] overflow-hidden"
      aria-hidden
    >
      {imageUrl ? (
        <>
          <motion.div className="absolute inset-[-28%]" style={{ y }}>
            <Image
              src={imageUrl}
              alt=""
              fill
              quality={90}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/38" />
          {/* Kanji: 美 (Schönheit/köstlich) – zentriertes Wasserzeichen */}
          <div
            className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            aria-hidden
          >
            <span
              className="font-light text-white/[0.07]"
              style={{
                fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", Georgia, serif',
                fontSize: "clamp(6rem, 16vw, 14rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              美
            </span>
          </div>
          {/* Crimson oben */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-crimson)]" />
          <div className="absolute top-[2px] left-0 right-0 h-px bg-[var(--color-crimson)]/18" />
          {/* Gold unten */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-gold)]" />
          <div className="absolute bottom-[2px] left-0 right-0 h-px bg-[var(--color-gold)]/18" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[var(--color-dark-card)] flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/22">
            Atmosphärenbild · Feld: divider_image
          </p>
        </div>
      )}
    </section>
  );
}
