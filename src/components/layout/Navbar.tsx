"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { Tenant } from "@/types";

const navLinks = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar({ tenant }: { tenant: Tenant | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#110805]/96 backdrop-blur-md border-b border-white/8 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-[68px] items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <span
              className="font-heading font-light uppercase tracking-[0.08em] text-white transition-colors duration-200 group-hover:text-[var(--color-gold)]"
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                letterSpacing: "0.06em",
              }}
            >
              {tenant?.name ?? "Little Tokyo"}
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-200 ${
                      isActive ? "text-[var(--color-gold)]" : "text-white/65 hover:text-white"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--color-gold)]"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              href="/reservierung"
              className={`font-mono text-[10px] uppercase tracking-[0.3em] px-6 py-2.5 transition-all duration-200 ${
                pathname === "/reservierung"
                  ? "bg-[var(--color-crimson)] text-white"
                  : "bg-[var(--color-crimson)] text-white hover:bg-[var(--color-crimson-deep)]"
              }`}
            >
              Reservierung
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Menü öffnen"
            onClick={() => setMobileOpen(true)}
            className="p-2 text-white/70 hover:text-white transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[280px] bg-[#110805] border-l border-white/8 lg:hidden"
            >
              <div className="flex h-[68px] items-center justify-between px-6 border-b border-white/8">
                <span
                  className="font-heading font-light uppercase text-white tracking-[0.06em]"
                  style={{ fontFamily: "var(--font-heading), serif", fontSize: "1.15rem" }}
                >
                  {tenant?.name ?? "Little Tokyo"}
                </span>
                <button
                  type="button"
                  aria-label="Menü schließen"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <ul className="flex flex-col divide-y divide-white/8 px-6 py-6">
                {[...navLinks, { href: "/reservierung", label: "Reservierung" }].map(
                  ({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center justify-between py-5 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors ${
                          pathname === href
                            ? "text-[var(--color-crimson)]"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {label}
                        <span className="text-white/20">→</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
