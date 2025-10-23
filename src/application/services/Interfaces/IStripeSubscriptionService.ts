import Stripe from "stripe";

export interface CreateStripeSubscriptionProduct {
  name: string;
  description?: string;
}

export interface CreateStripePrice {
  productId: string;
  amount: number;
  currency: string;
  interval: "month" | "year" | "none";
}

export interface CreateStripeCustomer {
  email: string;
  name: string;
}

export interface CreateCheckoutSessionInput {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionInput {
  customerId: string;
  priceId: string;
}

export interface IStripeSubscriptionService {
  createProduct(data: CreateStripeSubscriptionProduct): Promise<string>;
  createPrice(data: CreateStripePrice): Promise<string>;
  deleteProduct(productId: string): Promise<void>;
  updateProduct(
    productId: string,
    data: { name?: string; description?: string }
  ): Promise<void>;
  deactivatePrice(priceId: string): Promise<void>;
  updateProductActiveStatus(
    productId: string,
    isActive: boolean
  ): Promise<void>;
  updatePriceActiveStatus(priceId: string, isActive: boolean): Promise<void>;

  createCustomer(data: CreateStripeCustomer): Promise<{ id: string }>;
  deleteCustomer(customerId: string): Promise<void>;
  createCheckoutSession(
    data: CreateCheckoutSessionInput
  ): Promise<{ url: string }>;
  createSubscription(data: CreateSubscriptionInput): Promise<{ id: string }>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  constructWebhookEvent(data: {
    rawBody: Buffer;
    signature: string;
  }): Promise<Stripe.Event>;
  getSubscription(stripeSubscriptionId: string): Promise<any>;
  cancelAtPeriodEnd(subscriptionId: string): Promise<void>;
}
