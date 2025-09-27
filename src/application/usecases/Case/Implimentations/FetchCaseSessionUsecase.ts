import { SessionData } from "@src/application/dtos/sessions/FetchSessionsDto";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IFetchCaseSessionsUsecase } from "../Interfaces/IFetchCaseSessionsUsecase";

export class FetchCaseSessionUsecase implements IFetchCaseSessionsUsecase {
    constructor(private _sessionRepo: ISessionsRepo) {}

    async execute(input: string): Promise<SessionData[] | []> {
        return this._sessionRepo.findByCase(input);
    }
}
