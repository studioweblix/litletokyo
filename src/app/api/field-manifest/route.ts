import { NextResponse } from "next/server";

/**
 * GET /api/field-manifest
 *
 * Gibt alle editierbaren Sektionen dieser Website als JSON zurück.
 * Wird vom StudioWeblix Dashboard verwendet, um den Page-Editor aufzubauen.
 *
 * Jeder `key` entspricht exakt dem Schlüssel, den die jeweilige Seite aus
 * `pages.content` (Supabase) liest.
 */
export function GET() {
  const manifest = [
    // ─────────────────────────────────────────────
    // STARTSEITE  (page slug: "home")
    // ─────────────────────────────────────────────
    {
      slug: "home",
      title: "Startseite",
      field_config: [
        {
          id: "hero",
          label: "Hero",
          fields: [
            { key: "hero_title",    label: "Titel",                      type: "text"     },
            { key: "hero_subtitle", label: "Untertitel / Kicker",         type: "text"     },
            { key: "hero_image",    label: "Hintergrundbild",             type: "image"    },
            { key: "hero_cta",      label: "Button-Text (Speisekarte)",   type: "text"     },
          ],
        },
        {
          id: "divider",
          label: "Atmosphären-Bild",
          fields: [
            {
              key:   "divider_image",
              label: "Trennbild (auch Bewertungen-Hintergrund-Fallback)",
              type:  "image",
            },
          ],
        },
        {
          id: "highlights",
          label: "Highlights / Kategorien",
          fields: [
            { key: "highlights_kicker", label: "Kicker",      type: "text" },
            { key: "highlights_title",  label: "Überschrift", type: "text" },
          ],
        },
        {
          id: "oeffnungszeiten",
          label: "Öffnungszeiten",
          fields: [
            { key: "hours_kicker",    label: "Kicker",              type: "text"     },
            { key: "hours_title",     label: "Überschrift",         type: "text"     },
            { key: "hours_intro",     label: "Einleitungstext",     type: "textarea" },
            { key: "hours_box_kicker",label: "Tabellen-Label",      type: "text"     },
          ],
        },
        {
          id: "testimonials",
          label: "Bewertungen",
          fields: [
            {
              key:   "testimonials_bg",
              label: "Hintergrundbild (überschreibt Trennbild)",
              type:  "image",
            },
            { key: "testimonials_kicker", label: "Kicker",      type: "text" },
            { key: "testimonials_title",  label: "Überschrift", type: "text" },
          ],
        },
        {
          id: "infocard_1",
          label: "Info-Card 1 (Über uns)",
          fields: [
            { key: "infocard_1_subtitle", label: "Kicker",        type: "text"     },
            { key: "infocard_1_title",    label: "Überschrift",   type: "text"     },
            { key: "infocard_1_text",     label: "Text",          type: "textarea" },
            { key: "infocard_1_cta",      label: "Button-Text",   type: "text"     },
            { key: "infocard_image_1",    label: "Bild",          type: "image"    },
          ],
        },
        {
          id: "infocard_2",
          label: "Info-Card 2 (Speisekarte)",
          fields: [
            { key: "infocard_2_subtitle", label: "Kicker",        type: "text"     },
            { key: "infocard_2_title",    label: "Überschrift",   type: "text"     },
            { key: "infocard_2_text",     label: "Text",          type: "textarea" },
            { key: "infocard_2_cta",      label: "Button-Text",   type: "text"     },
            { key: "infocard_image_2",    label: "Bild",          type: "image"    },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // ÜBER UNS  (page slug: "about")
    // Felder werden sowohl auf /ueber-uns als auch
    // in der About-Sektion der Startseite genutzt.
    // ─────────────────────────────────────────────
    {
      slug: "about",
      title: "Über uns",
      field_config: [
        {
          id: "hero",
          label: "Hero (Seite /ueber-uns)",
          fields: [
            { key: "hero_title", label: "Seitentitel",          type: "text"  },
            { key: "hero_image", label: "Hero-Hintergrundbild", type: "image" },
          ],
        },
        {
          id: "geschichte",
          label: "Geschichte / Hauptsektion",
          fields: [
            { key: "section1_subtitle", label: "Kicker",       type: "text"     },
            { key: "section1_title",    label: "Überschrift",  type: "text"     },
            { key: "text",              label: "Text",         type: "textarea" },
            { key: "image",             label: "Hauptbild",    type: "image"    },
            { key: "image2",            label: "Zweites Bild", type: "image"    },
          ],
        },
        {
          id: "startseite_about",
          label: "Startseite – About-Sektion",
          fields: [
            {
              key:   "title",
              label: "Überschrift (Startseite About-Block)",
              type:  "text",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // SPEISEKARTE  (page slug: "speisekarte")
    // hero_image wird auch als Fallback für
    // Kontakt- und Reservierungs-Hero genutzt.
    // ─────────────────────────────────────────────
    {
      slug: "speisekarte",
      title: "Speisekarte",
      field_config: [
        {
          id: "hero",
          label: "Hero",
          fields: [
            {
              key:   "hero_image",
              label: "Hero-Hintergrundbild (Fallback für Kontakt & Reservierung)",
              type:  "image",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // KONTAKT  (page slug: "kontakt")
    // ─────────────────────────────────────────────
    {
      slug: "kontakt",
      title: "Kontakt",
      field_config: [
        {
          id: "hero",
          label: "Hero",
          fields: [
            {
              key:   "hero_image",
              label: "Hero-Hintergrundbild (fällt auf speisekarte.hero_image zurück)",
              type:  "image",
            },
          ],
        },
        {
          id: "kontakt_inhalt",
          label: "Kontakt-Inhalt",
          fields: [
            {
              key:   "description",
              label: "Beschreibungstext unter der Überschrift",
              type:  "textarea",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // RESERVIERUNG  (page slug: "reservierung")
    // ─────────────────────────────────────────────
    {
      slug: "reservierung",
      title: "Reservierung",
      field_config: [
        {
          id: "hero",
          label: "Hero",
          fields: [
            {
              key:   "hero_image",
              label: "Hero-Hintergrundbild (fällt auf speisekarte.hero_image zurück)",
              type:  "image",
            },
          ],
        },
      ],
    },
  ];

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
