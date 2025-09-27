import {
    FetchSessionsInputDto,
    FetchSessionOutputDto,
} from "@src/application/dtos/client/FetchSessionsDto";
import { IFetchSessionsUseCase } from "../IFetchSessionsUseCase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchSessionsUseCase implements IFetchSessionsUseCase {
    constructor(private _sessionRepo: ISessionsRepo) {}

    async execute(input: FetchSessionsInputDto): Promise<FetchSessionOutputDto> {
        return await this._sessionRepo.aggregate({ ...input, role: "client" });
    }
}
