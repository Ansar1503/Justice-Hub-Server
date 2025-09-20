import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IFetchCasesByQueryUsecase } from "../Interfaces/IFetchCasesByQuery";
import {
  FetchCaseQueryType,
  FindCasesWithPagination,
} from "@src/application/dtos/Cases/FindCasesByQueryDto";

export class FetchAllCasesByQueryUsecase implements IFetchCasesByQueryUsecase {
  constructor(private _casesRepository: ICaseRepo) {}
  async execute(input: FetchCaseQueryType): Promise<FindCasesWithPagination> {
    return await this._casesRepository.findByQuery(input);
  }
}
