import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { IBaseRepository } from "./IBaseRepo";

export interface IUserSubscriptionRepo
  extends IBaseRepository<UserSubscription> {}
