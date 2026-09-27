"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { FavouriteIcon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { createDonation, type DonateState } from "@/actions/donate";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { donateConfig, type DonationProvider, type ProviderOption } from "@/config/donate";
import { t } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { currencySymbol, formatMoney } from "@/utils/format";

const initialState: DonateState = { error: null };

const providerLogo: Record<DonationProvider, { src: string; tile: boolean }> = {
  paystack: { src: "/brands/paystack.png", tile: true },
  squad: { src: "/brands/squad.svg", tile: true },
  bachs: { src: "/brands/bachs.png", tile: false },
};

function ProviderLabel({ id, detail }: { id: DonationProvider; detail?: string }) {
  const logo = providerLogo[id];
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl",
          logo.tile && "border-2 border-line bg-white p-1.5",
        )}
      >
        <Image src={logo.src} alt="" width={36} height={36} unoptimized className="size-full object-contain" />
      </span>
      <span className="flex min-w-0 flex-col text-left leading-tight">
        <span className="font-black text-ink">{donateConfig.providerNames[id]}</span>
        {detail && <span className="truncate text-xs font-bold text-muted">{detail}</span>}
      </span>
    </span>
  );
}

export function DonateForm({ providers }: { providers: ProviderOption[] }) {
  const { dict } = useI18n();
  const copy = dict.donate;
  const [state, formAction, pending] = useActionState(createDonation, initialState);
  const [preset, setPreset] = useState<number | null>(donateConfig.defaultAmount);
  const [custom, setCustom] = useState("");
  const [provider, setProvider] = useState<DonationProvider>();

  const { currency } = donateConfig;
  const amount = preset ?? Number(custom);
  const valid = Number.isFinite(amount) && amount >= donateConfig.minAmount && amount <= donateConfig.maxAmount;
  const emailRequired = provider ? donateConfig.emailRequired.includes(provider) : false;
  const selected = providers.find((p) => p.id === provider);

  return (
    <Card className="w-full">
      <form action={formAction} className="grid gap-6">
        <fieldset>
          <legend className="mb-3 text-sm font-extrabold text-ink">{copy.chooseAmount}</legend>
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
                    "h-14 rounded-full border-2 border-b-4 text-lg font-black transition-colors outline-none focus-visible:ring-4 focus-visible:ring-info/40",
                    active ? "border-primary bg-primary-soft text-primary-dark" : "border-line bg-white text-ink hover:bg-surface",
                  )}
                >
                  {formatMoney(value, currency)}
                </button>
              );
            })}
          </div>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-muted">
              {currencySymbol(currency)}
            </span>
            <Input
              aria-label={t(copy.customAmountLabel, { currency })}
              inputMode="decimal"
              placeholder={copy.customAmount}
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

        <div>
          <Label htmlFor="provider">{copy.payWith}</Label>
          <Select name="provider" value={provider ?? ""} onValueChange={(v) => setProvider(v as DonationProvider)}>
            <SelectTrigger id="provider" className="h-16">
              <SelectValue placeholder={copy.payWithPlaceholder}>
                {provider && <ProviderLabel id={provider} detail={copy.providers[provider]} />}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.id} disabled={!p.available} className="py-2">
                  <span className="flex items-center gap-3">
                    <ProviderLabel id={p.id} detail={copy.providers[p.id]} />
                    {!p.available ? (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-extrabold text-muted">
                        {copy.comingSoon}
                      </span>
                    ) : (
                      !p.live && (
                        <span className="rounded-full bg-info-soft px-2 py-0.5 text-[11px] font-extrabold text-info-dark">
                          {copy.testMode}
                        </span>
                      )
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selected && !selected.live && (
            <p className="mt-2 text-xs font-bold text-info-dark">{copy.testModeNote}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">{copy.name}</Label>
            <Input id="name" name="name" placeholder={copy.namePlaceholder} maxLength={60} autoComplete="name" className="h-12 text-base" />
          </div>
          <div>
            <Label htmlFor="email">{emailRequired ? copy.emailRequired : copy.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required={emailRequired}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              className="h-12 text-base"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message">{copy.note}</Label>
          <Textarea id="message" name="message" placeholder={copy.notePlaceholder} maxLength={280} />
        </div>

        {state.error && (
          <p role="alert" className="rounded-2xl bg-error-soft px-4 py-3 text-sm font-bold text-error-dark">
            {t(copy.errors[state.error], {
              amount: formatMoney(state.error === "max" ? donateConfig.maxAmount : donateConfig.minAmount, currency),
            })}
          </p>
        )}

        <div>
          <Button type="submit" size="lg" block disabled={!valid || !provider || pending}>
            <Icon icon={FavouriteIcon} />
            {pending ? copy.opening : valid ? t(copy.donateAmount, { amount: formatMoney(amount, currency) }) : copy.donate}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-bold text-muted">
            <Icon icon={SecurityCheckIcon} size={14} />
            {provider ? t(copy.secure, { provider: donateConfig.providerNames[provider] }) : copy.secureGeneric}
          </p>
        </div>
      </form>
    </Card>
  );
}
