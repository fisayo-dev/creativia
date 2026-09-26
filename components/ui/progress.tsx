import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
  style?: CSSProperties;
};

/** chunky duolingo-style progress bar with a glossy highlight */
export function Progress({ value, className, barClassName, label, style }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-4 w-full overflow-hidden rounded-full bg-line", className)}
      style={style}
    >
      <div
        className={cn("relative h-full rounded-full bg-primary transition-[width] duration-500 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
      >
        {pct > 4 && <span className="absolute inset-x-2 top-[20%] h-[25%] rounded-full bg-white/30" />}
      </div>
    </div>
  );
}
