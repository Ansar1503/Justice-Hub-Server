import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IAddSubscriptionPlanUsecase } from "../IAddSubscriptionPlanUsecase";
import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";

export class AddSubscriptionPlanUsecase implements IAddSubscriptionPlanUsecase {
  constructor(private _subscriptionRepo: ISubscriptionRepo) {}
  async execute(
    input: Omit<SubscriptionBaseDto, "id" | "createdAt" | "updatedAt">
  ): Promise<SubscriptionBaseDto> {
    const subscriptionPayload = SubscriptionPlan.create({
      benefits: {
        autoRenew: input.benefits.autoRenew,
        bookingsPerMonth: input.benefits.bookingsPerMonth,
        chatAccess: input.benefits.chatAccess,
        discountPercent: input.benefits.discountPercent,
        documentUploadLimit: input.benefits.documentUploadLimit,
        expiryAlert: input.benefits.expiryAlert,
        followupBookingsPerCase: input.benefits.followupBookingsPerCase,
      },
      interval: input.interval,
      name: input.name,
      price: input.price,
      description: input.description,
      isFree: input.isFree,
      stripePriceId: input.stripePriceId,
      stripeProductId: input.stripeProductId,
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
  }
}
