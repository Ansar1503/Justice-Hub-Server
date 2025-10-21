import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IAddSubscriptionPlanUsecase } from "../IAddSubscriptionPlanUsecase";
import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";

export class AddSubscriptionPlanUsecase implements IAddSubscriptionPlanUsecase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService
  ) {}
  async execute(
    input: Omit<SubscriptionBaseDto, "id" | "createdAt" | "updatedAt">
  ): Promise<SubscriptionBaseDto> {
    console.log("input", input);
    const existingSubscriptionPlans = await this._subscriptionRepo.findAll();
    if (existingSubscriptionPlans.length >= 3) {
      throw new Error("You can only add up to 3 subscription plans");
    }
    const duplicatePlan = existingSubscriptionPlans.find(
      (plan) =>
        plan.name === input.name ||
        plan.price === input.price ||
        plan.interval === input.interval
    );

    if (duplicatePlan !== null && duplicatePlan !== undefined) {
      throw new Error("A similar subscription plan already exists");
    }

    let stripeProductId: string | undefined;
    let stripePriceId: string;

    try {
      const productId = await this._stripeSubscriptionService.createProduct({
        name: input.name,
        description: input.description,
      });
      stripeProductId = productId;

      stripePriceId = await this._stripeSubscriptionService.createPrice({
        productId,
        amount: input.price,
        currency: "INR",
        interval:
          input.interval === "none"
            ? "none"
            : input.interval === "monthly"
              ? "month"
              : "year",
      });

      const subscriptionPayload = SubscriptionPlan.create({
        benefits: input.benefits,
        interval: input.interval,
        name: input.name,
        price: input.price,
        description: input.description,
        isFree: input.isFree,
        stripePriceId,
        stripeProductId,
      });

      const newSubscriptionPlan =
        await this._subscriptionRepo.create(subscriptionPayload);

      return {
        benefits: {
          autoRenew: newSubscriptionPlan.benefits.autoRenew,
          bookingsPerMonth: newSubscriptionPlan.benefits.bookingsPerMonth,
          chatAccess: newSubscriptionPlan.benefits.chatAccess,
          discountPercent: newSubscriptionPlan.benefits.discountPercent,
          documentUploadLimit: newSubscriptionPlan.benefits.documentUploadLimit,
          expiryAlert: newSubscriptionPlan.benefits.expiryAlert,
          followupBookingsPerCase:
            newSubscriptionPlan.benefits.followupBookingsPerCase,
        },
        createdAt: newSubscriptionPlan.createdAt,
        id: newSubscriptionPlan.id,
        interval: newSubscriptionPlan.interval,
        isActive: newSubscriptionPlan.isActive,
        isFree: newSubscriptionPlan.isFree,
        name: newSubscriptionPlan.name,
        price: newSubscriptionPlan.price,
        updatedAt: newSubscriptionPlan.updatedAt,
        description: newSubscriptionPlan.description,
        stripePriceId: newSubscriptionPlan.stripePriceId,
        stripeProductId: newSubscriptionPlan.stripeProductId,
      };
    } catch (error) {
      console.error("Error while creating subscription plan:", error);

      if (stripeProductId) {
        try {
          await this._stripeSubscriptionService.deleteProduct(stripeProductId);
        } catch (cleanupError) {
          console.error("Failed to clean up Stripe product:", cleanupError);
        }
      }

      throw new Error("Failed to create subscription plan");
    }
  }
}
