"use server";

import { redirect } from "next/navigation";
import { donateConfig } from "@/config/donate";
import { siteConfig } from "@/config/site";
import { BachsError, createCheckoutSession, isBachsConfigured } from "@/lib/bachs";
import { cleanName } from "@/utils/text";

export type DonateState = { error: string | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createDonation(_prev: DonateState, formData: FormData): Promise<DonateState> {
  const amount = Number(formData.get("amount"));
  const name = cleanName(String(formData.get("name") ?? ""), 60);
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim().slice(0, 280);

  if (!Number.isFinite(amount) || amount < donateConfig.minAmount) {
    return { error: `the minimum donation is $${donateConfig.minAmount}.` };
  }
  if (amount > donateConfig.maxAmount) {
    return { error: `the maximum donation is $${donateConfig.maxAmount}.` };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { error: "that email doesn't look right." };
  }
  if (!isBachsConfigured()) {
    return { error: "donations aren't set up yet. please check back soon!" };
  }

  let checkoutUrl: string;
  try {
    const session = await createCheckoutSession({
      amount: amount.toFixed(2),
      currency: donateConfig.currency,
      successUrl: `${siteConfig.url}/donate/thanks`,
      cancelUrl: `${siteConfig.url}/donate`,
      // omit the customer so the hosted page collects details when no email is given
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
      error:
        error instanceof BachsError && error.status && error.status < 500
          ? "we couldn't start that payment. please try a different amount."
          : "payments are having a moment. please try again shortly.",
    };
  }

  // redirect() throws, so it must live outside the try/catch
  redirect(checkoutUrl);
}
