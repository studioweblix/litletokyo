import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import type { Tenant, StoreSettings } from "@/types";

const footerLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string | null | undefined;
  label: string;
  icon: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border border-white/12 text-white/40 transition-all duration-200 hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)]"
    >
      {icon}
    </a>
  );
}

export function Footer({
  tenant,
  settings,
}: {
  tenant: Tenant | null;
  settings: StoreSettings | null;
}) {
  const year = new Date().getFullYear();
  const tenantName = tenant?.name ?? "Little Tokyo";

  const mapsQuery = settings?.address ? encodeURIComponent(settings.address) : "";
  const mapsUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
    : null;

  return (
    <footer className="bg-[#0a0402] text-[var(--color-foreground)]">
      {/* Top-Rand */}
      <div className="h-[2px] bg-[var(--color-crimson)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-16 pb-12 lg:pt-20 lg:pb-14">

        {/* Brand-Zeile */}
        <div className="mb-12 pb-10 border-b border-white/8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-3">
              <span
                className="font-heading font-light uppercase text-white leading-none"
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {tenantName}
              </span>
              {/* Crimson-Punkt */}
              <span
                className="h-2.5 w-2.5 rounded-full bg-[var(--color-crimson)] shrink-0 mb-0.5"
                aria-hidden
              />
            </div>
            {/* Gold-Linie */}
            <div className="mt-4 h-px w-12 bg-[var(--color-gold)]" />
          </div>

          {/* Social Icons */}
          <div className="flex gap-2.5">
            <SocialIcon
              href={settings?.instagram}
              label="Instagram"
              icon={<Instagram className="h-3.5 w-3.5" />}
            />
            <SocialIcon
              href={settings?.facebook}
              label="Facebook"
              icon={<Facebook className="h-3.5 w-3.5" />}
            />
            <SocialIcon
              href={settings?.tiktok}
              label="TikTok"
              icon={<TikTokIcon />}
            />
          </div>
        </div>

        {/* 3-Spalten-Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">

          {/* Adresse */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)] mb-5 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Adresse
            </p>
            {settings?.address ? (
              <div className="space-y-3 text-[0.875rem] text-white/52 leading-relaxed">
                <p className="whitespace-pre-line">{settings.address}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)] hover:underline"
                  >
                    Auf Karte →
                  </a>
                )}
              </div>
            ) : (
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/22">
                Keine Adresse hinterlegt.
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)] mb-5">
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { href: "/ueber-uns", label: "Über uns" },
                { href: "/speisekarte", label: "Speisekarte" },
                { href: "/reservierung", label: "Reservierung" },
                { href: "/kontakt", label: "Kontakt" },
                ...footerLinks,
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[var(--color-crimson)] mb-5">
              Kontakt
            </p>
            <div className="space-y-3 text-[0.875rem] text-white/52">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Phone className="h-3 w-3 shrink-0 text-[var(--color-gold)]" />
                  {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Mail className="h-3 w-3 shrink-0 text-[var(--color-gold)]" />
                  {settings.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Bar */}
      <div className="border-t border-white/6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 sm:flex-row sm:px-8 lg:px-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/28">
            &copy; {year} {tenantName}
          </span>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/18">
            Website by StudioWeblix
          </p>
        </div>
      </div>
    </footer>
  );
}
