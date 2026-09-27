import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { navLinks, siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";

export async function SiteFooter() {
  const dict = await getDictionary();
  return (
    <footer className="border-t-2 border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm font-bold text-muted sm:flex-row sm:px-6">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} {siteConfig.name} · {dict.footer.wordsFrom}{" "}
          <a href={siteConfig.source} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-primary">
            {dict.footer.source}
          </a>
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {dict.nav[link.key]}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </footer>
  );
}
