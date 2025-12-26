import { FetchSessionsInputDto, FetchSessionsOutputtDto } from "@src/application/dtos/sessions/FetchSessionsDto";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IFetchSessionUseCase } from "../IFetchSessionUseCase";

export class FetchSessionUseCase implements IFetchSessionUseCase {
    constructor(private _sessionRepo: ISessionsRepo) {}
    async execute(input: FetchSessionsInputDto): Promise<FetchSessionsOutputtDto> {
        const sessions = await this._sessionRepo.findSessionsAggregate(input);
        return sessions;
    }
}
