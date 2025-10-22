import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { IBaseRepository } from "./IBaseRepo";

export interface IUserSubscriptionRepo
  extends IBaseRepository<UserSubscription> {
  findByUser(userId: string): Promise<UserSubscription | null>;
  createOrUpdate(
    subscription: UserSubscription
  ): Promise<UserSubscription | null>;
  findByStripeSubscriptionId(
    subscriptionId: string
  ): Promise<UserSubscription | null>;
  findByStripeCustomerId(customerId: string): Promise<UserSubscription | null>;
}
