import Stripe from "stripe";
import "dotenv/config";
import { format } from "date-fns";
import { session } from "passport";

type payloadType = {
  userEmail: string;
  lawyer_name: string;
  profile_image: string;
  date: string;
  slot: string;
  amount: number;
};

export async function getStripeSession(payload: payloadType) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: payload.userEmail,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Lawyer Consultation: ${payload.lawyer_name}`,
            description: `Slot:${format(payload.date, "yyyy-mm-dd")} Time:${
              payload.slot
            }`,
            images: ["noimage"],
          },
          unit_amount: payload.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/client/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:5000/",
    metadata: {
      lawyer_name: payload.lawyer_name,
      slot: payload.slot,
      date: payload.date,
      amount: String(payload.amount),
    },
  });
  return session;
}

export async function handleStripeWebHook(
  body: any,
  signature: string | string[]
) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    throw new Error("WEBHOOKSECRETNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const event = await stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  // console.log('event:',event)
  if (event.type === "charge.succeeded") {
  }
}

export async function getSessionDetails(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return await stripe.checkout.sessions.retrieve(sessionId);
}
