"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeSubscriptionService = void 0;
const stripe_1 = __importDefault(require("stripe"));
require("dotenv/config");
class StripeSubscriptionService {
    stripe;
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    }
    async createProduct(data) {
        try {
            const product = await this.stripe.products.create({
                name: data.name,
                description: data.description,
            });
            return product.id;
        }
        catch {
            throw new Error("Failed to create product in Stripe");
        }
    }
    async createPrice(data) {
        try {
            let price;
            if (data.interval !== "none") {
                price = await this.stripe.prices.create({
                    product: data.productId,
                    unit_amount: data.amount * 100,
                    currency: data.currency,
                    recurring: { interval: data.interval },
                });
            }
            else {
                price = await this.stripe.prices.create({
                    product: data.productId,
                    unit_amount: data.amount * 100,
                    currency: data.currency,
                });
            }
            return price.id;
        }
        catch {
            throw new Error("Failed to create price in Stripe");
        }
    }
    async deleteProduct(productId) {
        try {
            await this.stripe.products.del(productId);
        }
        catch {
            throw new Error("Failed to delete Stripe product");
        }
    }
    async updateProduct(productId, data) {
        try {
            await this.stripe.products.update(productId, data);
        }
        catch {
            throw new Error("Failed to update Stripe product");
        }
    }
    async deactivatePrice(priceId) {
        try {
            await this.stripe.prices.update(priceId, { active: false });
        }
        catch {
            throw new Error("Failed to deactivate Stripe price");
        }
    }
    async updateProductActiveStatus(productId, isActive) {
        try {
            await this.stripe.products.update(productId, { active: isActive });
        }
        catch {
            throw new Error(`Failed to ${isActive ? "activate" : "deactivate"} Stripe product`);
        }
    }
    async updatePriceActiveStatus(priceId, isActive) {
        try {
            await this.stripe.prices.update(priceId, { active: isActive });
        }
        catch {
            throw new Error(`Failed to ${isActive ? "activate" : "deactivate"} Stripe price`);
        }
    }
    async createCustomer(data) {
        try {
            const customer = await this.stripe.customers.create({
                email: data.email,
                name: data.name,
            });
            return { id: customer.id };
        }
        catch {
            throw new Error("Failed to create Stripe customer");
        }
    }
    async createCheckoutSession(data) {
        try {
            const payload = {
                mode: "subscription",
                line_items: [{ price: data.priceId, quantity: 1 }],
                success_url: data.successUrl,
                cancel_url: data.cancelUrl,
                metadata: data.metadata,
            };
            if (data.customerId && data.customerId.trim().length > 0) {
                payload.customer = data.customerId;
            }
            else if (data.customerEmail) {
                payload.customer_email = data.customerEmail;
            }
            const session = await this.stripe.checkout.sessions.create(payload);
            return { url: session.url };
        }
        catch (error) {
            console.log("error creating checkout session:", error);
            throw new Error("Failed to create Stripe checkout session");
        }
    }
    async createSubscription(data) {
        try {
            const subscription = await this.stripe.subscriptions.create({
                customer: data.customerId,
                items: [{ price: data.priceId }],
                payment_behavior: "default_incomplete",
                expand: ["latest_invoice.payment_intent"],
            });
            return { id: subscription.id };
        }
        catch {
            throw new Error("Failed to create Stripe subscription");
        }
    }
    async cancelSubscription(subscriptionId) {
        try {
            await this.stripe.subscriptions.cancel(subscriptionId);
        }
        catch (error) {
            throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async constructWebhookEvent(data) {
        try {
            const event = this.stripe.webhooks.constructEvent(data.rawBody, data.signature, process.env.STRIPE_WEBHOOK_SECRET);
            return event;
        }
        catch (error) {
            console.error("⚠️ Webhook signature verification failed:", error);
            throw new Error("Invalid Stripe webhook signature");
        }
    }
    async deleteCustomer(customerId) {
        try {
            await this.stripe.customers.del(customerId);
            console.log(`✅ Deleted Stripe customer: ${customerId}`);
        }
        catch (error) {
            console.error("❌ Failed to delete Stripe customer:", error);
            throw new Error("Failed to delete Stripe customer");
        }
    }
    async getSubscription(stripeSubscriptionId) {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
            return subscription;
        }
        catch (error) {
            console.error("❌ Failed to fetch Stripe subscription:", error);
            throw new Error("Failed to fetch Stripe subscription details");
        }
    }
    async cancelAtPeriodEnd(subscriptionId) {
        try {
            await this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        }
        catch (error) {
            console.error("❌ Stripe cancel_at_period_end failed:", error);
            throw new Error("Failed to schedule subscription cancellation.");
        }
    }
}
exports.StripeSubscriptionService = StripeSubscriptionService;
