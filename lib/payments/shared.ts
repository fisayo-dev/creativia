import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export class PaymentError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

export type CheckoutInput = {
  /** our own reference, also the last segment of the thank-you url */
  reference: string;
  /** major units, e.g. 2500 for ₦2,500 */
  amount: number;
  currency: string;
  email?: string;
  name?: string;
  message?: string;
  successUrl: string;
  cancelUrl: string;
};

export type PaymentStatus = "paid" | "pending" | "failed";

export type VerifiedPayment = { status: PaymentStatus; amount: number; currency: string };

export type PaymentProvider = {
  isConfigured(): boolean;
  /** false while pointed at a sandbox, so the form can flag it */
  isLive(): boolean;
  /** returns the hosted checkout url to send the donor to */
  createCheckout(input: CheckoutInput): Promise<string>;
  /** asks the provider directly. redirect params are never proof of payment */
  verify(reference: string, searchParams: Record<string, string | undefined>): Promise<VerifiedPayment>;
};

/** alphanumeric only: squad rejects anything else in transaction_ref */
export function createReference() {
  return `CRV${Date.now().toString(36)}${randomBytes(6).toString("hex")}`.toUpperCase();
}

export const REFERENCE_RE = /^[A-Z0-9]{8,64}$/;

/** kobo and cents are both 1/100 */
export const toMinorUnits = (amount: number) => Math.round(amount * 100);
export const fromMinorUnits = (amount: number) => amount / 100;

export function hmac(algorithm: "sha256" | "sha512", secret: string, payload: string) {
  return createHmac(algorithm, secret).update(payload, "utf8").digest("hex");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** fetches json with a bearer key and turns any non-2xx into a PaymentError */
export async function requestJson<T>(
  provider: string,
  url: string,
  key: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(init.body !== undefined && { "Content-Type": "application/json" }),
    },
    ...(init.body !== undefined && { body: JSON.stringify(init.body) }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  // paystack and squad put the reason in `message`, bachs in `detail`
  const body = (await res.json().catch(() => null)) as (T & { message?: string; detail?: string }) | null;
  if (!res.ok || !body) {
    throw new PaymentError(body?.detail ?? body?.message ?? `${provider} request failed (${res.status})`, res.status);
  }
  return body;
}
