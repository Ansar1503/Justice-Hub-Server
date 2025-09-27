import { StartSessionOutputDto } from "@src/application/dtos/Lawyer/StartSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IJoinSessionUseCase extends IUseCase<{ sessionId: string }, StartSessionOutputDto> {}
