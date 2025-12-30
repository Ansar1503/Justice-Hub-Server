import { IUseCase } from "../IUseCases/IUseCase";

export interface IResetPasswordUsecase
  extends IUseCase<{ token: string; password: string }, void> {}
