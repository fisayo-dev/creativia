import Link from "next/link";
import { Brain02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "grid size-10 place-items-center rounded-2xl bg-primary text-white shadow-[0_3px_0_var(--color-primary-dark)]",
        className,
      )}
    >
      <Icon icon={Brain02Icon} size={size} />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-info/40", className)}>
      <LogoMark />
      <span className="text-2xl font-black tracking-tight text-primary">{siteConfig.name}</span>
    </Link>
  );
}
