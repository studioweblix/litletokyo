import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface InfoCard {
  subtitle: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  imageUrl: string | null;
}

interface InfoCardsProps {
  cards: InfoCard[];
}

const PANEL_BG = ["bg-[var(--color-dark-card)]", "bg-[var(--color-dark)]"];

function CardImage({ src }: { src: string | null }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-dark-surface)] font-mono text-[10px] uppercase tracking-widest text-white/20">
        Bild einfügen
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover scale-[1.01] transform-gpu transition-transform duration-700 group-hover:scale-[1.04]"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

export function InfoCards({ cards }: InfoCardsProps) {
  if (cards.length === 0) return null;

  return (
    <section>
      {cards.map((card, i) => {
        const imageLeft = i % 2 === 0;
        const panelBg = PANEL_BG[i % 2];

        return (
          <AnimatedSection key={card.title} animation="fadeIn" as="div">
            <div
              className={`grid md:grid-cols-2 md:items-stretch ${
                imageLeft ? "" : "md:[direction:rtl]"
              }`}
            >
              {/* Bild */}
              <div className="group relative min-h-[260px] overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[380px]">
                <CardImage src={card.imageUrl} />
                {/* Crimson-Linie links am Bild */}
                <div
                  className={`absolute top-0 bottom-0 w-[3px] bg-[var(--color-crimson)] z-10 ${
                    imageLeft ? "left-0" : "right-0"
                  }`}
                />
              </div>

              {/* Text */}
              <div
                className={`flex flex-col justify-center px-8 py-14 sm:px-12 md:px-16 lg:px-20 md:[direction:ltr] ${panelBg}`}
              >
                {/* Kicker */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="block h-[2px] w-6 bg-[var(--color-crimson)]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)]">
                    {card.subtitle}
                  </p>
                </div>

                {/* Titel */}
                <h3
                  className="font-heading font-light uppercase text-white leading-[0.93]"
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {card.title}
                </h3>

                {/* Gold-Linie */}
                <div className="mt-6 mb-6 h-px w-14 bg-[var(--color-gold)]" />

                {/* Body */}
                <p className="text-[0.9rem] leading-[1.85] text-white/55" style={{ maxWidth: "46ch" }}>
                  {card.text}
                </p>

                {/* CTA */}
                <div className="mt-10">
                  <Link
                    href={card.href}
                    className="group inline-flex items-center gap-3 border-b border-[var(--color-gold)]/45 pb-1 font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold)] transition-all hover:border-[var(--color-gold)] hover:gap-5"
                  >
                    {card.cta}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        );
      })}
    </section>
  );
}
