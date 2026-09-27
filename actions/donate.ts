"use server";

import { redirect } from "next/navigation";
import { donateConfig, isDonationProvider } from "@/config/donate";
import { siteConfig } from "@/config/site";
import { createReference, PaymentError, paymentProviders } from "@/lib/payments";
import { cleanName } from "@/utils/text";

export type DonateError =
  | "min"
  | "max"
  | "email"
  | "emailRequired"
  | "provider"
  | "notConfigured"
  | "rejected"
  | "unavailable";

export type DonateState = { error: DonateError | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createDonation(_prev: DonateState, formData: FormData): Promise<DonateState> {
  const amount = Number(formData.get("amount"));
  const providerId = formData.get("provider");
  const name = cleanName(String(formData.get("name") ?? ""), 60);
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim().slice(0, 280);

  if (!Number.isFinite(amount) || amount < donateConfig.minAmount) {
    return { error: "min" };
  }
  if (amount > donateConfig.maxAmount) {
    return { error: "max" };
  }
  if (!isDonationProvider(providerId)) {
    return { error: "provider" };
  }
  if (!email && donateConfig.emailRequired.includes(providerId)) {
    return { error: "emailRequired" };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { error: "email" };
  }

  const provider = paymentProviders[providerId];
  if (!provider.isConfigured()) {
    return { error: "notConfigured" };
  }

  // the reference lives in the path so providers can append their own query params safely
  const reference = createReference();
  let checkoutUrl: string;
  try {
    checkoutUrl = await provider.createCheckout({
      reference,
      amount: Math.round(amount * 100) / 100,
      currency: donateConfig.currency,
      ...(email && { email }),
      ...(name && { name }),
      ...(message && { message }),
      successUrl: `${siteConfig.url}/donate/thanks/${providerId}/${reference}`,
      cancelUrl: `${siteConfig.url}/donate`,
    });
  } catch (error) {
    console.error(`[donate] ${providerId} failed to create checkout`, error);
    return {
      error: error instanceof PaymentError && error.status && error.status < 500 ? "rejected" : "unavailable",
    };
  }

  redirect(checkoutUrl);
}
