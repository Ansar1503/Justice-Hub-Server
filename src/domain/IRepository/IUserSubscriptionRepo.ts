import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { IBaseRepository } from "./IBaseRepo";

export interface IUserSubscriptionRepo
  extends IBaseRepository<UserSubscription> {
  findByUser(userId: string): Promise<UserSubscription | null>;
  createOrUpdate(
    subscription: UserSubscription
  ): Promise<UserSubscription | null>;
}
