import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  localeForCountry,
  localeFromAcceptLanguage,
  type Locale,
} from "@/i18n/config";

/**
 * a language the player picked beats their location, which beats their browser language.
 * the country header is set by vercel (and cloudflare, if it sits in front).
 */
function detectLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
  return (
    localeForCountry(country) ?? localeFromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  // urls stay clean (/play, not /fr/play). the language is an internal route segment
  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("Vary", "Cookie, Accept-Language, X-Vercel-IP-Country");
  return response;
}

export const config = {
  // skip api routes, next internals and anything that looks like a file
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
