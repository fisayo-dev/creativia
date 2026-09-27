import Link from "next/link";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export async function SiteHeader({ className }: { className?: string }) {
  const dict = await getDictionary();
  return (
    <header className={cn("sticky top-0 z-30 border-b-2 border-line bg-white/90 backdrop-blur", className)}>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/donate" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
            <Icon icon={FavouriteIcon} size={18} className="text-error" />
            {dict.nav.donate}
          </Link>
          <Link href="/play" className={buttonVariants({ size: "sm" })}>
            {dict.nav.play}
          </Link>
        </nav>
      </div>
    </header>
  );
}
