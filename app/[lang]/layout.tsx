import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { siteConfig } from "@/config/site";
import { LOCALES } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import "../globals.css";

// self-hosted so dev and builds never depend on reaching google fonts.
// one variable file covers every weight; the latin subset covers all our languages
const nunito = localFont({
  src: "../../assets/fonts/nunito-variable-latin.woff2",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} · ${dict.meta.tagline}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: dict.meta.description,
    openGraph: {
      title: siteConfig.name,
      description: dict.meta.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: siteConfig.name, description: dict.meta.description },
  };
}

export const viewport: Viewport = {
  themeColor: "#FF8A1F",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <html lang={locale} className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
