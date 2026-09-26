import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm font-bold text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {siteConfig.name} · words from the{" "}
          <a href={siteConfig.source} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-primary">
            remote associates test
          </a>
        </p>
        <nav className="flex gap-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
