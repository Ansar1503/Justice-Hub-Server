import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { ISubscribePlanUsecase } from "../ISubscribePlanUsecase";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import "dotenv/config";

export class SubscribePlanUsecase implements ISubscribePlanUsecase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService,
    private _userRepo: IUserRepository,
  ) {}

  async execute(input: {
    userId: string;
    planId: string;
  }): Promise<{ checkoutUrl?: string }> {
    const plan = await this._subscriptionRepo.findById(input.planId);
    if (!plan || !plan.stripePriceId) throw new Error("No valid plan found");

    const user = await this._userRepo.findByuser_id(input.userId);
    if (!user) throw new Error("User not found");

    const existingSub = await this._userSubscriptionRepo.findByUser(
      input.userId,
    );

    if (existingSub) {
      const currentPlan = await this._subscriptionRepo.findById(
        existingSub.planId,
      );
      if (!currentPlan) throw new Error("Current plan not found");
      const isDowngrade = currentPlan.price > plan.price || plan.isFree;

      if (isDowngrade) {
        let endDate = new Date();
        if (existingSub.endDate) {
          endDate = existingSub.endDate;
        } else {
          if (currentPlan.interval === "yearly")
            endDate.setDate(endDate.getDate() + 365);
          else endDate.setDate(endDate.getDate() + 30);
        }
        if (new Date() < endDate) {
          throw new Error(
            `You can only downgrade after ${endDate.toDateString()}.`,
          );
        }
      }
    }

    if (plan.isFree) {
      if (
        existingSub &&
        existingSub.status === "active" &&
        existingSub.stripeSubscriptionId
      ) {
        throw new Error(
          "To downgrade to free plan, please wait until your current paid subscription period ends.",
        );
      }
    }
    const cancelUrl = `${process.env.FRONTEND_URL}${process.env.STRIPE_SUBSCRIPTION_CANCEL_URL}`;
    const successUrl = `${process.env.FRONTEND_URL}${process.env.STRIPE_SUBSCRIPTION_SUCCESS_URL}`;
    console.log("Stripe success URL =>", successUrl);
    console.log("Stripe cancel URL =>", cancelUrl);

    const checkoutSession =
      await this._stripeSubscriptionService.createCheckoutSession({
        customerId: existingSub?.stripeCustomerId,
        priceId: plan.stripePriceId,
        customerEmail: user.email,
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        metadata: {
          userId: input.userId,
          planId: input.planId,
          oldStripeSubscriptionId: existingSub?.stripeSubscriptionId ?? "",
        },
      });

    return { checkoutUrl: checkoutSession.url };
  }
}
