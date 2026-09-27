"use client";

import type { ComponentProps } from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({ className, children, ...props }: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
      <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
        <AlertDialogPrimitive.Content
          data-slot="alert-dialog-content"
          className={cn(
            "pointer-events-auto w-full max-w-sm rounded-3xl border-2 border-b-4 border-line bg-white p-6 text-ink outline-none",
            "data-[state=open]:animate-pop data-[state=closed]:animate-pop-out",
            className,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </div>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col items-center text-center", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("mt-6 grid w-full gap-3", className)} {...props} />;
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title className={cn("mt-4 text-2xl font-black", className)} {...props} />;
}

export function AlertDialogDescription({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description className={cn("mt-2 font-semibold text-muted", className)} {...props} />;
}

type ActionProps = ComponentProps<typeof AlertDialogPrimitive.Action> & VariantProps<typeof buttonVariants>;

export function AlertDialogAction({ className, variant, size = "lg", block = true, ...props }: ActionProps) {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}

export function AlertDialogCancel({ className, variant = "ghost", size, block = true, ...props }: ActionProps) {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}
