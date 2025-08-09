import { CancelSessionOutputDto } from "@src/application/dtos/Lawyer/CancelSessionDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IEndSessionUseCase
  extends IUseCase<{ sessionId: string }, CancelSessionOutputDto> {}
