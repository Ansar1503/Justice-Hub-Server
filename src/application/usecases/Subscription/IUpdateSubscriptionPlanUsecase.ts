import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateSubscriptionPlanUsecase
  extends IUseCase<
    Omit<SubscriptionBaseDto, "createdAt" | "updatedAt">,
    SubscriptionBaseDto
  > {}
