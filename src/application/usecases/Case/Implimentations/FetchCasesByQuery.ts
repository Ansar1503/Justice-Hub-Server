import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { FetchCaseQueryType, FindCasesWithPagination } from "@src/application/dtos/Cases/FindCasesByQueryDto";
import { IFetchCasesByQueryUsecase } from "../Interfaces/IFetchCasesByQuery";

export class FetchAllCasesByQueryUsecase implements IFetchCasesByQueryUsecase {
    constructor(private _casesRepository: ICaseRepo) {}
    async execute(input: FetchCaseQueryType): Promise<FindCasesWithPagination> {
        return await this._casesRepository.findByQuery(input);
    }
}
