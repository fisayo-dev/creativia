"use client";

import { useActionState, useState } from "react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { createDonation, type DonateState } from "@/actions/donate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input, Label, Textarea } from "@/components/ui/input";
import { donateConfig } from "@/config/donate";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/format";

const initialState: DonateState = { error: null };

export function DonateForm() {
  const [state, formAction, pending] = useActionState(createDonation, initialState);
  const [preset, setPreset] = useState<number | null>(donateConfig.defaultAmount);
  const [custom, setCustom] = useState("");

  const amount = preset ?? Number(custom);
  const valid = Number.isFinite(amount) && amount >= donateConfig.minAmount && amount <= donateConfig.maxAmount;

  return (
    <Card className="w-full">
      <form action={formAction} className="grid gap-6">
        <fieldset>
          <legend className="mb-3 text-sm font-extrabold text-ink">choose an amount</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {donateConfig.presets.map((value) => {
              const active = preset === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPreset(value)}
                  aria-pressed={active}
                  className={cn(
                    "h-14 rounded-full border-2 border-b-4 text-xl font-black transition-colors outline-none focus-visible:ring-4 focus-visible:ring-info/40",
                    active ? "border-primary bg-primary-soft text-primary-dark" : "border-line bg-white text-ink hover:bg-surface",
                  )}
                >
                  {formatMoney(value)}
                </button>
              );
            })}
          </div>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-muted">$</span>
            <Input
              aria-label="custom amount in dollars"
              inputMode="decimal"
              placeholder="custom amount"
              value={custom}
              onFocus={() => setPreset(null)}
              onChange={(e) => {
                setPreset(null);
                setCustom(e.target.value.replace(/[^0-9.]/g, ""));
              }}
              className={cn("pl-10", preset === null && "border-primary bg-white")}
            />
          </div>
          <input type="hidden" name="amount" value={valid ? amount.toFixed(2) : ""} />
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">name (optional)</Label>
            <Input id="name" name="name" placeholder="anonymous" maxLength={60} autoComplete="name" className="h-12 text-base" />
          </div>
          <div>
            <Label htmlFor="email">email (optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="for your receipt"
              autoComplete="email"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message">leave a note (optional)</Label>
          <Textarea id="message" name="message" placeholder="say hi to the team" maxLength={280} />
        </div>

        {state.error && (
          <p role="alert" className="rounded-2xl bg-error-soft px-4 py-3 text-sm font-bold text-error-dark">
            {state.error}
          </p>
        )}

        <div>
          <Button type="submit" size="lg" block disabled={!valid || pending}>
            <Icon icon={FavouriteIcon} />
            {pending ? "opening checkout…" : valid ? `donate ${formatMoney(amount)}` : "donate"}
          </Button>
          <p className="mt-3 text-center text-xs font-bold text-muted">
            secure checkout by bachs · cards, bank transfer & mobile money
          </p>
        </div>
      </form>
    </Card>
  );
}
