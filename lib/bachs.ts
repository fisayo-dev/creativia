import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * minimal bachs client. docs: https://docs.bachs.io
 * money is always a decimal string at currency precision, e.g. "5.00".
 */

const API_URL = (process.env.BACHS_API_URL ?? "https://sandbox-api.bachs.io").replace(/\/$/, "");

export class BachsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "BachsError";
  }
}

export function isBachsConfigured() {
  return Boolean(process.env.BACHS_API_KEY);
}

type CreateCheckoutInput = {
  amount: string;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  customer?: { email: string; name?: string };
  metadata?: Record<string, string>;
};

type CheckoutSession = {
  checkout_id: string;
  checkout_url: string;
  status: string;
};

/** creates a hosted checkout for a raw amount (no catalog product needed) */
export async function createCheckoutSession(input: CreateCheckoutInput): Promise<CheckoutSession> {
  const key = process.env.BACHS_API_KEY;
  if (!key) throw new BachsError("bachs is not configured");

  const res = await fetch(`${API_URL}/v1/checkout-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pricing: { currency: input.currency, amount: input.amount },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      ...(input.customer && { customer: input.customer }),
      ...(input.metadata && { metadata: input.metadata }),
    }),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as (CheckoutSession & { message?: string }) | null;
  if (!res.ok || !body?.checkout_url) {
    throw new BachsError(body?.message ?? `bachs request failed (${res.status})`, res.status);
  }
  return body;
}

const SIGNATURE_TOLERANCE_SECONDS = 300;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * verifies a webhook delivery. prefers X-Bachs-Signature-V2 ("t=...,v1=...,v1=...")
 * and falls back to X-Bachs-Timestamp + X-Bachs-Signature.
 */
export function verifyWebhookSignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.BACHS_WEBHOOK_SECRET;
  if (!secret) return false;

  let timestamp: string | null = null;
  let signatures: string[] = [];

  const v2 = headers.get("x-bachs-signature-v2");
  if (v2) {
    for (const part of v2.split(",")) {
      const [k, v] = part.split("=", 2).map((s) => s.trim());
      if (k === "t") timestamp = v;
      if (k === "v1" && v) signatures.push(v);
    }
  } else {
    timestamp = headers.get("x-bachs-timestamp");
    const sig = headers.get("x-bachs-signature");
    signatures = sig ? [sig] : [];
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - ts) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest("hex");
  return signatures.some((s) => safeEqual(expected, s));
}
