import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAllSubsrciptionPlansUsecase
  extends IUseCase<void, SubscriptionBaseDto[]> {}
