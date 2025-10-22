import { IUseCase } from "../IUseCases/IUseCase";

export interface ISubscribePlanUsecase
  extends IUseCase<
    { userId: string; planId: string },
    { checkoutUrl?: string }
  > {}
