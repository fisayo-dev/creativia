import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-3xl border-2 border-b-4 border-line bg-white p-5 sm:p-6", className)}
      {...props}
    />
  );
}
