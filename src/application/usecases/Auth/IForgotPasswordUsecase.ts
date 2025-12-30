import { IUseCase } from "../IUseCases/IUseCase";

export interface IForgotPasswordUsecase
  extends IUseCase<{ email: string }, void> {}
