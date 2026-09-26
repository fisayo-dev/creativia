import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-full",
    "font-extrabold lowercase tracking-wide transition-[transform,box-shadow,background-color,filter] duration-100",
    "outline-none focus-visible:ring-4 focus-visible:ring-info/40",
    "active:translate-y-1 active:shadow-none",
    "disabled:pointer-events-none disabled:bg-line disabled:text-muted disabled:shadow-[0_4px_0_var(--color-line-dark)]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-[0_4px_0_var(--color-primary-dark)] hover:brightness-105",
        success: "bg-success text-white shadow-[0_4px_0_var(--color-success-dark)] hover:brightness-105",
        error: "bg-error text-white shadow-[0_4px_0_var(--color-error-dark)] hover:brightness-105",
        info: "bg-info text-white shadow-[0_4px_0_var(--color-info-dark)] hover:brightness-105",
        outline:
          "border-2 border-line bg-white text-ink shadow-[0_4px_0_var(--color-line)] hover:bg-surface",
        ghost: "text-muted shadow-none hover:bg-surface hover:text-ink active:translate-y-0",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "size-11",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, block, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}
