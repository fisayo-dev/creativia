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


const API_URL = "https://api.paystack.co";

const secretKey = () => process.env.PAYSTACK_SECRET_KEY?.trim();

function requireKey() {
  const key = secretKey();
  if (!key) throw new PaymentError("paystack is not configured");
  return key;
}

type Envelope<T> = { status: boolean; message: string; data: T };

const STATUS: Record<string, PaymentStatus> = {
  success: "paid",
  failed: "failed",
  abandoned: "failed",
  reversed: "failed",
};

export const paystack: PaymentProvider = {
  isConfigured: () => Boolean(secretKey()),
  isLive: () => Boolean(secretKey()?.startsWith("sk_live_")),

  async createCheckout(input) {
    if (!input.email) throw new PaymentError("paystack needs an email", 400);
    const { data } = await requestJson<Envelope<{ authorization_url: string }>>(
      "paystack",
      `${API_URL}/transaction/initialize`,
      requireKey(),
      {
        method: "POST",
        body: {
          email: input.email,
          amount: String(toMinorUnits(input.amount)),
          currency: input.currency,
          reference: input.reference,
          callback_url: input.successUrl,
          metadata: {
            kind: "donation",
            // paystack sends the donor here if they close the checkout
            cancel_action: input.cancelUrl,
            custom_fields: [
              ...(input.name ? [{ display_name: "donor", variable_name: "donor_name", value: input.name }] : []),
              ...(input.message ? [{ display_name: "note", variable_name: "message", value: input.message }] : []),
            ],
          },
        },
      },
    );
    return data.authorization_url;
  },

  async verify(reference) {
    const { data } = await requestJson<Envelope<{ status: string; amount: number; currency: string }>>(
      "paystack",
      `${API_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      requireKey(),
    );
    return {
      status: STATUS[data.status] ?? "pending",
      amount: fromMinorUnits(data.amount),
      currency: data.currency,
    };
  },
};

export function verifyPaystackSignature(rawBody: string, headers: Headers): boolean {
  const key = secretKey();
  const signature = headers.get("x-paystack-signature");
  if (!key || !signature) return false;
  return safeEqual(hmac("sha512", key, rawBody), signature.toLowerCase());
}
