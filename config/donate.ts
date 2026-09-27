export const DONATION_PROVIDERS = ["paystack", "squad", "bachs"] as const;

export type DonationProvider = (typeof DONATION_PROVIDERS)[number];

export function isDonationProvider(value: unknown): value is DonationProvider {
  return DONATION_PROVIDERS.includes(value as DonationProvider);
}

export type ProviderOption = { id: DonationProvider; available: boolean; live: boolean };

export const donateConfig = {
  currency: "NGN",
  presets: [5000, 10000, 20000, 50000],
  defaultAmount: 2500,
  minAmount: 100,
  maxAmount: 5_000_000,
  providerNames: { paystack: "paystack", squad: "squad", bachs: "bachs" } satisfies Record<DonationProvider, string>,
  emailRequired: ["squad", "paystack"] as readonly DonationProvider[],
} as const;
