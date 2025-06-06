import Stripe from "stripe";
import "dotenv/config";
import { format } from "date-fns";
import { session } from "passport";

type WebhookResult = {
  amount?: number;
  lawyer_id?: string;
  client_id?: string;
  date?: string;
  time?: string;
  duration?: string | number;
  payment_status?: "pending" | "success" | "failed";
  eventHandled: boolean;
};

type payloadType = {
  userEmail: string;
  lawyer_name: string;
  date: string;
  slot: string;
  amount: number;
  lawyer_id: string;
  duration: number;
  client_id: string;
};

export async function getStripeSession(payload: payloadType) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const formattedDate = format(payload.date, "MMMM d yyyy");
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: payload.userEmail,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Lawyer Consultation: ${payload.lawyer_name}`,
            description: `Slot:${formattedDate} Time:${payload.slot}`,
            images: ["noimage"],
          },
          unit_amount: payload.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/client/lawyers/payment_success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/client/lawyers/${payload.lawyer_id}`,
    metadata: {
      lawyer_id: payload.lawyer_id,
      time: payload.slot,
      date: payload.date,
      amount: payload.amount,
      clientId: payload.client_id,
      duration: payload.duration,
    },
  });
  return session;
}

export async function handleStripeWebHook(
  body: any,
  signature: string | string[]
): Promise<WebhookResult> {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    throw new Error("WEBHOOKSECRETNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const event = await stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.payment_intent) {
        return {
          ...pluckMeta(session.metadata),
          payment_status: "failed",
          eventHandled: true,
        };
      }
      return {
        ...pluckMeta(session.metadata),
        amount: Number(session.amount_total ?? 0) / 100,
        payment_status: "success",
        eventHandled: true,
      };
    }
    case "payment_intent.payment_failed":
    case "payment_intent.canceled": {
      const intent = event.data.object as Stripe.PaymentIntent;
      return {
        ...pluckMeta(intent.metadata),
        amount: Number(intent.amount ?? 0) / 100,
        payment_status: "failed",
        eventHandled: true,
      };
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        ...pluckMeta(session.metadata),
        payment_status: "failed",
        eventHandled: true,
      };
    }
    default:
      return { eventHandled: false };
  }
}

export async function getSessionDetails(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return await stripe.checkout.sessions.retrieve(sessionId);
}

function pluckMeta(md: Stripe.Metadata | null | undefined) {
  return {
    lawyer_id: md?.lawyer_id,
    client_id: md?.clientId,
    date: md?.date,
    time: md?.time,
    duration: md?.duration,
  };
}
