import { verifyPaystackSignature } from "@/lib/payments/paystack";

type PaystackEvent = {
  event: string;
  data?: { reference?: string; amount?: number; currency?: string; status?: string; customer?: { email?: string } };
};

export async function POST(request: Request) {
  const raw = await request.text();

  if (!verifyPaystackSignature(raw, request.headers)) {
    return new Response("invalid signature", { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(raw) as PaystackEvent;
  } catch {
    return new Response("invalid payload", { status: 400 });
  }

  switch (event.event) {
    case "charge.success":
      console.info("[paystack] donation received", {
        reference: event.data?.reference,
        amount: event.data?.amount,
        currency: event.data?.currency,
      });
      break;
    default:
      break;
  }

  // paystack retries anything that isn't a 200
  return Response.json({ received: true });
}
