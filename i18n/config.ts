export const LOCALES = ["en", "es", "fr", "pt", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** set only when a player picks a language themselves. it beats location detection */
export const LOCALE_COOKIE = "creativia-locale";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "english",
  es: "español",
  fr: "français",
  pt: "português",
  de: "deutsch",
};

/** countries whose main language we support. everywhere else falls back to the browser language */
const COUNTRY_LOCALES: Partial<Record<Locale, string[]>> = {
  es: ["ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ"],
  fr: ["FR", "MC", "SN", "CI", "CM", "ML", "BF", "NE", "TG", "BJ", "GN", "CD", "CG", "GA", "MG", "HT", "TD", "CF", "BI", "DJ", "KM"],
  pt: ["PT", "BR", "AO", "MZ", "GW", "CV", "ST", "TL"],
  de: ["DE", "AT", "CH", "LI"],
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function localeForCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  const code = country.toUpperCase();
  for (const [locale, countries] of Object.entries(COUNTRY_LOCALES)) {
    if (countries.includes(code)) return locale as Locale;
  }
  return null;
}

/** picks the first supported language from an accept-language header, honouring q weights */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((r) => isLocale(r.lang))?.lang;
  return isLocale(match) ? match : null;
}
