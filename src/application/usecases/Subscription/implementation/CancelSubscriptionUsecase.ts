import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";

export class CancelSubscriptionUsecase {
  constructor(
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService
  ) {}

  async execute(input: { userId: string }): Promise<{ message: string }> {
    const existingSub = await this._userSubscriptionRepo.findByUser(
      input.userId
    );
    if (!existingSub) throw new Error("No active subscription found.");

    if (!existingSub.isActive()) {
      throw new Error("Subscription is already inactive or canceled.");
    }
    if (existingSub.stripeSubscriptionId) {
      try {
        await this._stripeSubscriptionService.cancelAtPeriodEnd(
          existingSub.stripeSubscriptionId
        );
      } catch (error) {
        console.error("❌ Failed to schedule cancellation:", error);
        throw new Error("Failed to cancel subscription at period end.");
      }
    }

    existingSub.setStatus("canceled");

    await this._userSubscriptionRepo.createOrUpdate(existingSub);

    return {
      message:
        "Your subscription will remain active until the end of your billing period.",
    };
  }
}
