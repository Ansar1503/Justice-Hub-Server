import { CancelSessionOutputDto } from "@src/application/dtos/Lawyer/CancelSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IEndSessionUseCase
  extends IUseCase<{ sessionId: string }, CancelSessionOutputDto> {}
