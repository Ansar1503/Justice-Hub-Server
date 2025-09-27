import {
    FetchCaseQueryType,
    FindCasesWithPagination,
} from "@src/application/dtos/Cases/FindCasesByQueryDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchCasesByQueryUsecase
  extends IUseCase<FetchCaseQueryType, FindCasesWithPagination> {}
