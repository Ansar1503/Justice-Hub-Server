import { StartSessionOutputDto } from "@src/application/dtos/Lawyer/StartSessionDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IJoinSessionUseCase
  extends IUseCase<{ sessionId: string }, StartSessionOutputDto> {}
