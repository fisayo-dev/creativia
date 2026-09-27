"use client";

import type { ComponentProps } from "react";
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Select as SelectPrimitive } from "radix-ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

type TriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** "field" matches the text inputs, "ghost" is a quiet inline control for headers and footers */
  variant?: "field" | "ghost";
};

export function SelectTrigger({ className, children, variant = "field", ...props }: TriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 font-bold outline-none transition-colors",
        "focus-visible:ring-4 focus-visible:ring-info/40 disabled:cursor-not-allowed disabled:opacity-60",
        "data-[placeholder]:text-muted/70 [&>span]:truncate",
        variant === "field" &&
          "h-14 w-full rounded-2xl border-2 border-line bg-surface px-5 text-lg text-ink data-[state=open]:border-info data-[state=open]:bg-white",
        variant === "ghost" &&
          "h-10 rounded-full px-3 text-sm text-muted hover:bg-surface hover:text-ink data-[state=open]:bg-surface data-[state=open]:text-ink",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon icon={ArrowDown01Icon} size={variant === "ghost" ? 16 : 20} className="shrink-0 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 overflow-hidden rounded-2xl border-2 border-b-4 border-line bg-white text-ink",
          "data-[state=open]:animate-pop data-[state=closed]:animate-pop-out",
          position === "popper" && "min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1.5 data-[side=top]:-translate-y-1.5",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted">
          <Icon icon={ArrowUp01Icon} size={16} />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted">
          <Icon icon={ArrowDown01Icon} size={16} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-xs font-extrabold text-muted", className)}
      {...props}
    />
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-3 pr-9 text-base font-bold outline-none",
        "data-[highlighted]:bg-surface data-[state=checked]:text-primary-dark data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex items-center">
        <SelectPrimitive.ItemIndicator>
          <Icon icon={Tick02Icon} size={18} className="text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("mx-2 my-1 h-0.5 bg-line", className)} {...props} />;
}
