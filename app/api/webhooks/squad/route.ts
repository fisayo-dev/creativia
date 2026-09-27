import { verifySquadSignature } from "@/lib/payments/squad";

type SquadEvent = {
  Event: string;
  TransactionRef?: string;
  Body?: { amount?: number; transaction_ref?: string; transaction_status?: string; currency?: string };
};

/**
 * squad webhook receiver. set {site}/api/webhooks/squad as the webhook url
 * under profile → api & webhook in the squad dashboard.
 * this is the source of truth for completed donations, not the thank-you redirect.
 */
export async function POST(request: Request) {
  // read the raw body before parsing; re-serializing could break the signature
  const raw = await request.text();

  if (!verifySquadSignature(raw, request.headers)) {
    return new Response("invalid signature", { status: 401 });
  }

  let event: SquadEvent;
  try {
    event = JSON.parse(raw) as SquadEvent;
  } catch {
    return new Response("invalid payload", { status: 400 });
  }

  switch (event.Event) {
    case "charge_successful":
      // hook up persistence here (e.g. a supporters wall), deduplicating on TransactionRef
      console.info("[squad] donation received", {
        reference: event.TransactionRef,
        amount: event.Body?.amount,
        currency: event.Body?.currency,
      });
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
