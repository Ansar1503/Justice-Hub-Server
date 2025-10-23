import { UserSubscriptionDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchCurrentUserSubscriptionUsecase
  extends IUseCase<string, UserSubscriptionDto | null> {}
