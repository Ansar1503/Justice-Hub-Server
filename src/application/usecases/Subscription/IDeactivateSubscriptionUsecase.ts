import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IChangeActiveSubscriptionStatusUsecase
  extends IUseCase<{id:string;status:boolean}, SubscriptionBaseDto> {}
