import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import { IBaseRepository } from "./IBaseRepo";

export interface ISubscriptionRepo extends IBaseRepository<SubscriptionPlan> {}
