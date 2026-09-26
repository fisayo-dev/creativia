import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-2xl border-2 border-line bg-surface px-5 text-lg font-bold text-ink",
        "placeholder:font-semibold placeholder:text-muted/70",
        "outline-none transition-colors focus:border-info focus:bg-white",
        "disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-2xl border-2 border-line bg-surface px-5 py-3 text-base font-semibold text-ink",
        "placeholder:text-muted/70 outline-none transition-colors focus:border-info focus:bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-2 block text-sm font-extrabold text-ink", className)} {...props} />;
}
