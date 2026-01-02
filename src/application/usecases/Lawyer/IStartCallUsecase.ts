import { IUseCase } from "../IUseCases/IUseCase";

export interface IStartCallUsecase
  extends IUseCase<
    { sessionId: string; roomId: string; userId: string },
    void
  > {}
