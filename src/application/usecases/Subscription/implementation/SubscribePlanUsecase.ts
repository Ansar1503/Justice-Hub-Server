import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { ISubscribePlanUsecase } from "../ISubscribePlanUsecase";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { IStripeSubscriptionService } from "@src/application/services/Interfaces/IStripeSubscriptionService";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import "dotenv/config";

export class SubscribePlanUsecase implements ISubscribePlanUsecase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepo,
    private _userSubscriptionRepo: IUserSubscriptionRepo,
    private _stripeSubscriptionService: IStripeSubscriptionService,
    private _userRepo: IUserRepository
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
      input.userId
    );

    let stripeCustomerId = existingSub?.stripeCustomerId;
    const stripeSubscriptionId = existingSub?.stripeSubscriptionId;

    if (!stripeCustomerId) {
      const customer = await this._stripeSubscriptionService.createCustomer({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
    }

    if (stripeSubscriptionId) {
      try {
        await this._stripeSubscriptionService.cancelSubscription(
          stripeSubscriptionId
        );
      } catch (error) {
        console.error("Failed to cancel previous subscription:", error);
      }
    }

    const checkoutSession =
      await this._stripeSubscriptionService.createCheckoutSession({
        customerId: stripeCustomerId,
        priceId: plan.stripePriceId,
        successUrl: process.env.STRIPE_SUCCESS_URL!,
        cancelUrl: process.env.STRIPE_CANCEL_URL!,
      });

    const userSubscription = existingSub
      ? existingSub
      : UserSubscription.create({
          userId: user.user_id,
          planId: plan.id,
          stripeCustomerId,
          startDate: new Date(),
          benefitsSnapshot: plan.benefits,
        });

    await this._userSubscriptionRepo.createOrUpdate(
      Object.assign(userSubscription, {
        planId: plan.id,
        stripeCustomerId,
        status: "trialing",
      })
    );

    return { checkoutUrl: checkoutSession.url };
  }
}
