import "server-only";
import { hmac, PaymentError, requestJson, safeEqual, type PaymentProvider, type PaymentStatus } from "./shared";


const API_URL = (process.env.BACHS_API_URL?.trim() || "https://sandbox-api.bachs.io").replace(/\/$/, "");

const secretKey = () => process.env.BACHS_API_KEY?.trim();

function requireKey() {
  const key = secretKey();
  if (!key) throw new PaymentError("bachs is not configured");
  return key;
}

type CheckoutSession = {
  checkout_id: string;
  checkout_url: string;
  status: string;
  payment_status?: string;
  amount?: string;
  currency?: string;
  reference?: string;
  pricing?: { amount?: string; currency?: string };
  charge?: { status?: string; amount?: string; currency?: string } | null;
};

// a finished checkout is `completed`, not `succeeded`. bachs also mixes casing
// between endpoints (collection events send `SUCCEEDED`), so compare lowercased
const STATUS: Record<string, PaymentStatus> = {
  completed: "paid",
  complete: "paid",
  succeeded: "paid",
  paid: "paid",
  abandoned: "failed",
  expired: "failed",
  canceled: "failed",
  cancelled: "failed",
  failed: "failed",
};

function sessionStatus(session: CheckoutSession): PaymentStatus {
  const lower = (s?: string | null) => s?.toLowerCase() ?? "";
  if (lower(session.payment_status) === "paid" || lower(session.charge?.status) === "succeeded") return "paid";
  return STATUS[lower(session.status)] ?? "pending";
}

const CHECKOUT_ID_RE = /^[A-Za-z0-9_-]{4,128}$/;

export const bachs: PaymentProvider = {
  isConfigured: () => Boolean(secretKey()),
  isLive: () => !API_URL.includes("sandbox"),

  async createCheckout(input) {
    const session = await requestJson<CheckoutSession>("bachs", `${API_URL}/v1/checkout-sessions`, requireKey(), {
      method: "POST",
      body: {
        pricing: { currency: input.currency, amount: input.amount.toFixed(2) },
        reference: input.reference,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        ...(input.email && { customer: { email: input.email, ...(input.name && { name: input.name }) } }),
        metadata: {
          kind: "donation",
          ...(input.name && { donor_name: input.name }),
          ...(input.message && { message: input.message }),
        },
      },
    });
    if (!session.checkout_url) throw new PaymentError("bachs returned no checkout url");
    return session.checkout_url;
  },

  async verify(reference, searchParams) {
    const checkoutId = searchParams.checkout_id;
    if (!checkoutId || !CHECKOUT_ID_RE.test(checkoutId)) throw new PaymentError("missing checkout_id", 400);

    const session = await requestJson<CheckoutSession>(
      "bachs",
      `${API_URL}/v1/checkout-sessions/${encodeURIComponent(checkoutId)}`,
      requireKey(),
    );
    // a checkout_id pasted onto someone else's thank-you url shouldn't show their amount
    if (session.reference && session.reference !== reference) throw new PaymentError("reference mismatch", 400);

    const status = sessionStatus(session);
    if (status === "pending") {
      // so production logs show what bachs actually sent if this ever sticks again
      console.warn("[bachs] checkout still pending", {
        checkout: checkoutId,
        status: session.status,
        payment_status: session.payment_status,
        charge_status: session.charge?.status,
      });
    }

    return {
      status,
      amount: Number(session.amount ?? session.charge?.amount ?? session.pricing?.amount ?? 0),
      currency: session.currency ?? session.charge?.currency ?? session.pricing?.currency ?? "",
    };
  },
};

const SIGNATURE_TOLERANCE_SECONDS = 300;


export function verifyBachsSignature(rawBody: string, headers: Headers): boolean {
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

  const expected = hmac("sha256", secret, `${timestamp}.${rawBody}`);
  return signatures.some((s) => safeEqual(expected, s));
}
