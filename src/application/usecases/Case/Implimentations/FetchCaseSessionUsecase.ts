import { SessionData } from "@src/application/dtos/sessions/FetchSessionsDto";
import { IFetchCaseSessionsUsecase } from "../Interfaces/IFetchCaseSessionsUsecase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchCaseSessionUsecase implements IFetchCaseSessionsUsecase {
  constructor(private _sessionRepo: ISessionsRepo) {}

  async execute(input: string): Promise<SessionData[] | []> {
    return this._sessionRepo.findByCase(input);
  }
}
