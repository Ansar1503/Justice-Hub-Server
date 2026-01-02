"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowupStripeSession = getFollowupStripeSession;
exports.getStripeSession = getStripeSession;
exports.handleStripeWebHook = handleStripeWebHook;
exports.getSessionDetails = getSessionDetails;
exports.getSessionMetaData = getSessionMetaData;
const stripe_1 = __importDefault(require("stripe"));
require("dotenv/config");
const date_fns_1 = require("date-fns");
async function getFollowupStripeSession(payload) {
    if (!process.env.STRIPE_SECRET_KEY)
        throw new Error("SECRETKEYNOTFOUND");
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const formattedDate = (0, date_fns_1.format)(new Date(payload.date), "MMMM d yyyy");
    const session = await stripe.checkout.sessions.create({
        customer_email: payload.userEmail,
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `Follow-up Consultation: ${payload.lawyer_name}`,
                        description: `Slot: ${formattedDate}, Time: ${payload.slot}`,
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
            caseId: payload.caseId,
            commissionPercent: payload.commissionPercent,
            commissionAmount: payload.commissionAmount,
            lawyerAmount: payload.lawyerAmount,
            bookingType: payload.bookingType,
            followupDiscountAmount: payload.followupDiscountAmount,
            subscriptionDiscountAmount: payload.subscriptionDiscountAmount,
            baseAmount: payload.baseAmount,
        },
    });
    return session;
}
async function getStripeSession(payload) {
    if (!process.env.STRIPE_SECRET_KEY)
        throw new Error("SECRETKEYNOTFOUND");
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const formattedDate = (0, date_fns_1.format)(payload.date, "MMMM d yyyy");
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
            subscriptionDiscountAmount: payload.subscriptionDiscountAmount,
            baseAmount: payload.baseAmount,
        },
    });
    return session;
}
async function handleStripeWebHook(body, signature) {
    if (!process.env.STRIPE_SECRET_KEY)
        throw new Error("SECRETKEYNOTFOUND");
    if (!process.env.STRIPE_WEBHOOK_SECRET)
        throw new Error("WEBHOOKSECRETNOTFOUND");
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const event = await stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            if (!session.payment_intent) {
                return {
                    ...pluckMeta(session.metadata),
                    paymentIntentId: session.id,
                    payment_status: "failed",
                    eventHandled: true,
                };
            }
            return {
                ...pluckMeta(session.metadata),
                paymentIntentId: session.id,
                amountPaid: Number(session.amount_total ?? 0) / 100,
                payment_status: "success",
                eventHandled: true,
            };
        }
        case "payment_intent.payment_failed":
        case "payment_intent.canceled": {
            const intent = event.data.object;
            return {
                ...pluckMeta(intent.metadata),
                paymentIntentId: intent.id,
                amountPaid: Number(intent.amount ?? 0) / 100,
                payment_status: "failed",
                eventHandled: true,
            };
        }
        case "checkout.session.async_payment_failed":
        case "checkout.session.expired": {
            const session = event.data.object;
            return {
                ...pluckMeta(session.metadata),
                paymentIntentId: session.id,
                payment_status: "failed",
                eventHandled: true,
            };
        }
        default:
            return { eventHandled: false };
    }
}
async function getSessionDetails(sessionId) {
    if (!process.env.STRIPE_SECRET_KEY)
        throw new Error("SECRETKEYNOTFOUND");
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    return await stripe.checkout.sessions.retrieve(sessionId);
}
async function getSessionMetaData(sessionId) {
    if (!process.env.STRIPE_SECRET_KEY) {
        const error = new Error("secret key not found");
        error.code = 400;
        throw error;
    }
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = pluckMeta(session.metadata);
    return metadata;
}
function pluckMeta(md) {
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
        bookingType: md?.bookingType === "initial" || md?.bookingType === "followup"
            ? md.bookingType
            : undefined,
        caseId: md?.caseId,
        followupDiscountAmount: md?.followupDiscountAmount
            ? Number(md.followupDiscountAmount)
            : undefined,
        subscriptionDiscountAmount: md?.subscriptionDiscountAmount
            ? Number(md.subscriptionDiscountAmount)
            : undefined,
        baseAmount: md?.baseAmount ? Number(md.baseAmount) : undefined,
    };
}
