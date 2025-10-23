import { IUseCase } from "../IUseCases/IUseCase";

export interface ICancelSubscriptionUsecase
  extends IUseCase<{ userId: string }, { message: string }> {}
