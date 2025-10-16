import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddSubscriptionPlanUsecase
  extends IUseCase<Omit<SubscriptionBaseDto, "id"|"createdAt"|"updatedAt">, SubscriptionBaseDto> {}
