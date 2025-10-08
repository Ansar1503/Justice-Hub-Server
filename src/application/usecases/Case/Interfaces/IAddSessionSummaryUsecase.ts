import { BaseSessionDto } from "@src/application/dtos/sessions/BaseSessionDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IAddSessionSummaryUsecase
  extends IUseCase<{ sessionId: string; summary: string }, BaseSessionDto> {}
