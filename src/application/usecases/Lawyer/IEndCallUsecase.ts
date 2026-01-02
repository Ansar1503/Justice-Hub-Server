import { IUseCase } from "../IUseCases/IUseCase";

export interface IEndCallUsecase
  extends IUseCase<{ sessionId: string; roomId: string }, void> {}
