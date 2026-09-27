/** the order here is the order in the "pay with" dropdown */
export const DONATION_PROVIDERS = ["squad", "paystack", "bachs"] as const;

export type DonationProvider = (typeof DONATION_PROVIDERS)[number];

export function isDonationProvider(value: unknown): value is DonationProvider {
  return DONATION_PROVIDERS.includes(value as DonationProvider);
}

/** everything the donate form may know about a provider. never keys or urls */
export type ProviderOption = { id: DonationProvider; available: boolean; live: boolean };

export const donateConfig = {
  /**
   * one currency for every provider, so the amount means the same thing whichever one the donor picks.
   * NGN works on all three out of the box. switch to "USD" only once it's enabled on your paystack account,
   * then update the presets and limits below.
   */
  currency: "NGN",
  presets: [1000, 2500, 5000, 10000],
  defaultAmount: 2500,
  minAmount: 100,
  maxAmount: 5_000_000,
  /** brand names are never translated */
  providerNames: { squad: "squad", paystack: "paystack", bachs: "bachs" } satisfies Record<DonationProvider, string>,
  /** squad and paystack refuse a checkout without a customer email */
  emailRequired: ["squad", "paystack"] as readonly DonationProvider[],
} as const;
