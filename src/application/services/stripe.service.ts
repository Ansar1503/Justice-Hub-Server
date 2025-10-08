import Stripe from "stripe";
import "dotenv/config";
import { format } from "date-fns";
type BookingType = "initial" | "followup";
type WebhookResult = {
  amountPaid?: number;
  lawyer_id?: string;
  client_id?: string;
  commissionPercent?: number;
  commissionAmount?: number;
  bookingType?: BookingType;
  lawyerAmount?: number;
  date?: string;
  time?: string;
  duration?: string;
  reason?: string;
  title?: string;
  caseTypeId?: string;
  payment_status?: "pending" | "success" | "failed";
  eventHandled: boolean;
};

type payloadType = {
  userEmail: string;
  commissionPercent: number;
  commissionAmount: number;
  lawyerAmount: number;
  lawyer_name: string;
  date: string;
  slot: string;
  amountPaid: number;
  lawyer_id: string;
  duration: number;
  client_id: string;
  reason?: string;
  title: string;
  caseTypeId: string;
  bookingType: BookingType;
};

export async function getStripeSession(payload: payloadType) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("SECRETKEYNOTFOUND");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const formattedDate = format(payload.date, "MMMM d yyyy");
  const session = await stripe.checkout.sessions.create({
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
          unit_amount: payload.amountPaid * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/client/lawyers/payment_success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/client/lawyers/${payload.lawyer_id}?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      lawyer_name: payload.lawyer_name,
      lawyer_id: payload.lawyer_id,
      time: payload.slot,
      date: payload.date,
      amount: String(payload.amountPaid),
      clientId: payload.client_id,
      duration: String(payload.duration),
      reason: payload?.reason ?? "",
      caseTypeId: payload.caseTypeId,
      title: payload.title,
      commissionPercent: payload.commissionPercent,
      commissionAmount: payload.commissionAmount,
      lawyerAmount: payload.lawyerAmount,
      bookingType: payload.bookingType,
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
        amountPaid: Number(session.amount_total ?? 0) / 100,
        payment_status: "success",
        eventHandled: true,
      };
    }
    case "payment_intent.payment_failed":
    case "payment_intent.canceled": {
      const intent = event.data.object as Stripe.PaymentIntent;
      return {
        ...pluckMeta(intent.metadata),
        amountPaid: Number(intent.amount ?? 0) / 100,
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

export async function getSessionMetaData(sessionId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error: any = new Error("secret key not found");
    error.code = 400;
    throw error;
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const metadata = pluckMeta(session.metadata);
  return metadata;
}

function pluckMeta(md: Stripe.Metadata | null | undefined) {
  return {
    lawyer_id: md?.lawyer_id,
    client_id: md?.clientId,
    date: md?.date,
    time: md?.time,
    duration: md?.duration,
    reason: md?.reason,
    caseTypeId: md?.caseTypeId,
    title: md?.title,
    commissionPercent: md?.commissionPercent
      ? Number(md.commissionPercent)
      : undefined,
    lawyerAmount: md?.lawyerAmount ? Number(md.lawyerAmount) : undefined,
    commissionAmount: md?.commissionAmount
      ? Number(md.commissionAmount)
      : undefined,
    bookingType:
      md?.bookingType === "initial" || md?.bookingType === "followup"
        ? (md.bookingType as BookingType)
        : undefined,
  };
}
