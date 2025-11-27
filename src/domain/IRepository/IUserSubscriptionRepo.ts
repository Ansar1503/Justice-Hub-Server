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
  getSubscriptionRevenueSummary(start: Date, end: Date): Promise<{
    totalSubscriptionRevenue: number;
    newSubscriptions: number;
  }>;

  getSubscriptionTrends(start: Date, end: Date): Promise<
    { date: string; revenue: number }[]
  >;

  getSubscriptionGrowth(start: Date, end: Date): Promise<number>;

  countActiveSubscriptions(): Promise<number>;
  countExpiredSubscriptions(): Promise<number>;
  countNewSubscriptions(start: Date, end: Date): Promise<number>;
}
