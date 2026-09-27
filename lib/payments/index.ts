import "server-only";
import { DONATION_PROVIDERS, type DonationProvider, type ProviderOption } from "@/config/donate";
import { bachs } from "./bachs";
import { paystack } from "./paystack";
import type { PaymentProvider } from "./shared";
import { squad } from "./squad";

export { createReference, PaymentError, REFERENCE_RE, type VerifiedPayment } from "./shared";

export const paymentProviders: Record<DonationProvider, PaymentProvider> = { squad, paystack, bachs };

export function getProviderOptions(): ProviderOption[] {
  return DONATION_PROVIDERS.map((id) => ({
    id,
    available: paymentProviders[id].isConfigured(),
    live: paymentProviders[id].isLive(),
  }));
}
