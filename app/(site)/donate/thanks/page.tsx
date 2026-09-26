import type { Metadata } from "next";
import Link from "next/link";
import { FavouriteIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "thank you", robots: { index: false } };

export default function DonateThanksPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
      <span className="animate-pop grid size-24 place-items-center rounded-full bg-success text-white shadow-[0_6px_0_var(--color-success-dark)]">
        <Icon icon={FavouriteIcon} size={48} />
      </span>
      <h1 className="mt-6 text-4xl font-black text-ink">thank you!</h1>
      <p className="mt-3 text-lg font-semibold text-muted">
        your support keeps creativia free for curious minds everywhere.
      </p>
      <div className="mt-10 grid w-full gap-3">
        <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          <Icon icon={PlayIcon} />
          play a round
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
          back home
        </Link>
      </div>
    </div>
  );
}
