import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const dict = await getDictionary();
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <LogoMark className="animate-float size-20 rounded-3xl" size={44} />
      <h1 className="mt-6 text-4xl font-black text-ink">{dict.notFound.title}</h1>
      <p className="mt-2 font-semibold text-muted">{dict.notFound.body}</p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        {dict.notFound.home}
      </Link>
    </main>
  );
}
