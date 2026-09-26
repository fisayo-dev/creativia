import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

/** thin wrapper so every icon shares the same stroke weight */
export function Icon({ strokeWidth = 2.2, size = 22, ...props }: HugeiconsIconProps) {
  return <HugeiconsIcon strokeWidth={strokeWidth} size={size} aria-hidden {...props} />;
}
