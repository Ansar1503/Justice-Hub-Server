import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUpdateSubscriptionPlanUsecase } from "../IUpdateSubscriptionPlanUsecase";
import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";

export class UpdateSubscriptionPlanUsecase
  implements IUpdateSubscriptionPlanUsecase
{
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService
  ) {}
  async execute(
    input: Omit<SubscriptionBaseDto, "createdAt" | "updatedAt">
  ): Promise<SubscriptionBaseDto> {
    const planExists = await this._subscriptionRepo.findById(input.id);
    if (!planExists) throw new Error("No plan exists with the provided ID");
    if (
      input.name !== planExists.name ||
      input.description !== planExists.description
    ) {
      await this._stripeSubscriptionService.updateProduct(
        planExists.stripeProductId!,
        { name: input.name, description: input.description }
      );
    }

    let newStripePriceId = planExists.stripePriceId;
    if (
      input.price !== planExists.price ||
      input.interval !== planExists.interval
    ) {
      if (planExists.stripePriceId) {
        await this._stripeSubscriptionService.deactivatePrice(
          planExists.stripePriceId
        );
      }

      newStripePriceId = await this._stripeSubscriptionService.createPrice({
        productId: planExists.stripeProductId!,
        amount: input.price,
        currency: "INR",
        interval:
          input.interval === "none"
            ? "none"
            : input.interval === "monthly"
              ? "month"
              : "year",
      });
    }

    const updatedData = await this._subscriptionRepo.update({
      ...input,
      stripePriceId: newStripePriceId,
    });
    if (!updatedData) throw new Error("subscription plan update failed");
    return {
      id: updatedData.id,
      name: updatedData.name,
      description: updatedData.description,
      price: updatedData.price,
      interval: updatedData.interval,
      stripeProductId: updatedData.stripeProductId,
      stripePriceId: updatedData.stripePriceId,
      isFree: updatedData.isFree,
      isActive: updatedData.isActive,
      benefits: {
        autoRenew: updatedData.benefits.autoRenew,
        bookingsPerMonth: updatedData.benefits.bookingsPerMonth,
        chatAccess: updatedData.benefits.chatAccess,
        discountPercent: updatedData.benefits.discountPercent,
        documentUploadLimit: updatedData.benefits.documentUploadLimit,
        expiryAlert: updatedData.benefits.expiryAlert,
        followupBookingsPerCase: updatedData.benefits.followupBookingsPerCase,
      },
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
    };
  }
}
