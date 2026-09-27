"use server";

import { redirect } from "next/navigation";
import { donateConfig } from "@/config/donate";
import { siteConfig } from "@/config/site";
import { BachsError, createCheckoutSession, isBachsConfigured } from "@/lib/bachs";
import { cleanName } from "@/utils/text";

export type DonateError = "min" | "max" | "email" | "notConfigured" | "rejected" | "unavailable";

export type DonateState = { error: DonateError | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createDonation(_prev: DonateState, formData: FormData): Promise<DonateState> {
  const amount = Number(formData.get("amount"));
  const name = cleanName(String(formData.get("name") ?? ""), 60);
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim().slice(0, 280);

  if (!Number.isFinite(amount) || amount < donateConfig.minAmount) {
    return { error: "min" };
  }
  if (amount > donateConfig.maxAmount) {
    return { error: "max" };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { error: "email" };
  }
  if (!isBachsConfigured()) {
    return { error: "notConfigured" };
  }

  let checkoutUrl: string;
  try {
    const session = await createCheckoutSession({
      amount: amount.toFixed(2),
      currency: donateConfig.currency,
      successUrl: `${siteConfig.url}/donate/thanks`,
      cancelUrl: `${siteConfig.url}/donate`,
      ...(email && { customer: { email, ...(name && { name }) } }),
      metadata: {
        kind: "donation",
        ...(name && { donor_name: name }),
        ...(message && { message }),
      },
    });
    checkoutUrl = session.checkout_url;
  } catch (error) {
    console.error("[donate] failed to create checkout", error);
    return {
      error: error instanceof BachsError && error.status && error.status < 500 ? "rejected" : "unavailable",
    };
  }

  redirect(checkoutUrl);
}
