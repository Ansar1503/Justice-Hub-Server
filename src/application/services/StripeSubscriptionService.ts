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
}
