import { SessionData } from "@src/application/dtos/sessions/FetchSessionsDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchCaseSessionsUsecase extends IUseCase<string, SessionData[] | []> {}
