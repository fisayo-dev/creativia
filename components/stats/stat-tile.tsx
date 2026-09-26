import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const tones = {
  primary: "border-primary text-primary [&_[data-head]]:bg-primary",
  success: "border-success text-success [&_[data-head]]:bg-success",
  info: "border-info text-info [&_[data-head]]:bg-info",
  error: "border-error text-error [&_[data-head]]:bg-error",
} as const;

type StatTileProps = {
  label: string;
  value: string | number;
  icon: IconSvgElement;
  tone?: keyof typeof tones;
};

/** duolingo "lesson complete" style stat: colored header strip with a big value below */
export function StatTile({ label, value, icon, tone = "primary" }: StatTileProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border-2 bg-white", tones[tone])}>
      <p data-head className="px-2 py-1 text-center text-xs font-black tracking-wide text-white">
        {label}
      </p>
      <p className="flex items-center justify-center gap-1.5 px-2 py-3 text-xl font-black tabular-nums sm:text-2xl">
        <Icon icon={icon} size={22} />
        {value}
      </p>
    </div>
  );
}
