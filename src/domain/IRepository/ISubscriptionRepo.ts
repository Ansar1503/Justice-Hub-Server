import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import { IBaseRepository } from "./IBaseRepo";
import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";

export interface ISubscriptionRepo extends IBaseRepository<SubscriptionPlan> {
  findAll(): Promise<SubscriptionPlan[] | []>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  update(
    payload: Omit<SubscriptionBaseDto, "createdAt" | "updatedAt">
  ): Promise<SubscriptionPlan | null>;
  updateActiveStatus(
    id: string,
    status: boolean
  ): Promise<SubscriptionPlan | null>;
  findFreeTier(): Promise<SubscriptionPlan | null >;
}
