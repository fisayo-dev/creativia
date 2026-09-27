import { verifyBachsSignature } from "@/lib/payments/bachs";

type BachsEvent = {
  id: string;
  type: string;
  data?: { checkout_id?: string; amount?: string; currency?: string; metadata?: Record<string, string> };
};

/**
 * bachs webhook receiver. point your bachs webhook destination at
 * {site}/api/webhooks/bachs and subscribe to collection.succeeded.
 * this is the source of truth for completed donations, not the thank-you redirect.
 */
export async function POST(request: Request) {
  // read the raw body before parsing; re-serializing would break the signature
  const raw = await request.text();

  if (!verifyBachsSignature(raw, request.headers)) {
    return new Response("invalid signature", { status: 401 });
  }

  let event: BachsEvent;
  try {
    event = JSON.parse(raw) as BachsEvent;
  } catch {
    return new Response("invalid payload", { status: 400 });
  }

  switch (event.type) {
    case "collection.succeeded":
      // hook up persistence here (e.g. a supporters wall), deduplicating on event.id
      console.info("[bachs] donation received", {
        event: event.id,
        checkout: event.data?.checkout_id,
        amount: event.data?.amount,
        currency: event.data?.currency,
      });
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
