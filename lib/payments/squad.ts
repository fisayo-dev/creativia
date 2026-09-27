import "server-only";
import {
  fromMinorUnits,
  hmac,
  PaymentError,
  requestJson,
  safeEqual,
  toMinorUnits,
  type PaymentProvider,
  type PaymentStatus,
} from "./shared";

/**
 * minimal squad (gtco) client. docs: https://docs.squadco.com
 * sandbox and live are separate hosts with separate keys.
 */

const API_URL = (process.env.SQUAD_API_URL?.trim() || "https://sandbox-api-d.squadco.com").replace(/\/$/, "");

const secretKey = () => process.env.SQUAD_SECRET_KEY?.trim();

function requireKey() {
  const key = secretKey();
  if (!key) throw new PaymentError("squad is not configured");
  return key;
}

type Envelope<T> = { status: number; message: string; data: T };

const STATUS: Record<string, PaymentStatus> = {
  success: "paid",
  failed: "failed",
  abandoned: "failed",
};

export const squad: PaymentProvider = {
  isConfigured: () => Boolean(secretKey()),
  isLive: () => !API_URL.includes("sandbox"),

  async createCheckout(input) {
    if (!input.email) throw new PaymentError("squad needs an email", 400);
    const { data } = await requestJson<Envelope<{ checkout_url: string }>>(
      "squad",
      `${API_URL}/transaction/Initiate`,
      requireKey(),
      {
        method: "POST",
        body: {
          amount: toMinorUnits(input.amount),
          email: input.email,
          currency: input.currency,
          initiate_type: "inline",
          transaction_ref: input.reference,
          // squad appends ?reference=… to this. ours is already in the path, so the query is ignored
          callback_url: input.successUrl,
          ...(input.name && { customer_name: input.name }),
          metadata: {
            kind: "donation",
            ...(input.name && { donor_name: input.name }),
            ...(input.message && { message: input.message }),
          },
        },
      },
    );
    return data.checkout_url;
  },

  async verify(reference) {
    const { data } = await requestJson<
      Envelope<{ transaction_status: string; transaction_amount: number; transaction_currency_id: string }>
    >("squad", `${API_URL}/transaction/verify/${encodeURIComponent(reference)}`, requireKey());
    return {
      status: STATUS[data.transaction_status.toLowerCase()] ?? "pending",
      amount: fromMinorUnits(data.transaction_amount),
      currency: data.transaction_currency_id,
    };
  },
};

/**
 * x-squad-encrypted-body is an uppercase hex HMAC-SHA512 of the body, keyed with the secret key.
 * squad signs its own serialization, so also try the compact re-serialization if the raw bytes differ.
 */
export function verifySquadSignature(rawBody: string, headers: Headers): boolean {
  const key = secretKey();
  const signature = headers.get("x-squad-encrypted-body")?.toUpperCase();
  if (!key || !signature) return false;

  const candidates = [rawBody];
  try {
    candidates.push(JSON.stringify(JSON.parse(rawBody)));
  } catch {
    return false;
  }
  return candidates.some((body) => safeEqual(hmac("sha512", key, body).toUpperCase(), signature));
}
