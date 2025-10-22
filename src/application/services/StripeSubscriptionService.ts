import Stripe from "stripe";
import {
  CreateStripePrice,
  CreateStripeSubscriptionProduct,
  IStripeSubscriptionService,
} from "./Interfaces/IStripeSubscriptionService";
import "dotenv/config";

export class StripeSubscriptionService implements IStripeSubscriptionService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  async createProduct(data: CreateStripeSubscriptionProduct): Promise<string> {
    try {
      const product = await this.stripe.products.create({
        name: data.name,
        description: data.description,
      });
      return product.id;
    } catch (error) {
      throw new Error("Failed to create product in Stripe");
    }
  }

  async createPrice(data: CreateStripePrice): Promise<string> {
    try {
      let price: Stripe.Price;
      if (data.interval !== "none") {
        price = await this.stripe.prices.create({
          product: data.productId,
          unit_amount: data.amount * 100,
          currency: data.currency,
          recurring: { interval: data.interval },
        });
      } else {
        price = await this.stripe.prices.create({
          product: data.productId,
          unit_amount: data.amount * 100,
          currency: data.currency,
        });
      }
      return price.id;
    } catch (error) {
      throw new Error("Failed to create price in Stripe");
    }
  }
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.stripe.products.del(productId);
    } catch (error) {
      throw new Error("Failed to delete Stripe product");
    }
  }
  async updateProduct(
    productId: string,
    data: { name?: string; description?: string }
  ): Promise<void> {
    try {
      await this.stripe.products.update(productId, data);
    } catch (error) {
      throw new Error("Failed to update Stripe product");
    }
  }

  async deactivatePrice(priceId: string): Promise<void> {
    try {
      await this.stripe.prices.update(priceId, { active: false });
    } catch (error) {
      throw new Error("Failed to deactivate Stripe price");
    }
  }
  async updateProductActiveStatus(
    productId: string,
    isActive: boolean
  ): Promise<void> {
    try {
      await this.stripe.products.update(productId, { active: isActive });
    } catch (error) {
      throw new Error(
        `Failed to ${isActive ? "activate" : "deactivate"} Stripe product`
      );
    }
  }

  async updatePriceActiveStatus(
    priceId: string,
    isActive: boolean
  ): Promise<void> {
    try {
      await this.stripe.prices.update(priceId, { active: isActive });
    } catch (error) {
      throw new Error(
        `Failed to ${isActive ? "activate" : "deactivate"} Stripe price`
      );
    }
  }

  async createCustomer(data: { email: string; name: string }) {
    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
      });
      return { id: customer.id };
    } catch (error) {
      throw new Error("Failed to create Stripe customer");
    }
  }

  async createCheckoutSession(data: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: "subscription",
        customer: data.customerId,
        line_items: [{ price: data.priceId, quantity: 1 }],
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        metadata: data.metadata,
      });

      return { url: session.url! };
    } catch (error) {
      throw new Error("Failed to create Stripe checkout session");
    }
  }

  async createSubscription(data: { customerId: string; priceId: string }) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: data.priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });
      return { id: subscription.id };
    } catch (error) {
      throw new Error("Failed to create Stripe subscription");
    }
  }
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
      throw new Error(
        `Failed to cancel subscription: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  async constructWebhookEvent(data: {
    rawBody: Buffer;
    signature: string;
  }): Promise<Stripe.Event> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        data.rawBody,
        data.signature,
        process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!
      );
      return event;
    } catch (error: any) {
      console.error("⚠️ Webhook signature verification failed:", error);
      throw new Error("Invalid Stripe webhook signature");
    }
  }
}
