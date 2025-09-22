import { Case } from "@domain/entities/Case";
import { IBaseRepository } from "./IBaseRepo";
import {
  AggregatedCasesData,
  FetchCaseQueryType,
  FindCasesWithPagination,
} from "@src/application/dtos/Cases/FindCasesByQueryDto";

export interface ICaseRepo extends IBaseRepository<Case> {
  findByQuery(
    payload: FetchCaseQueryType & { userId: string }
  ): Promise<FindCasesWithPagination>;
  findById(id: string): Promise<AggregatedCasesData | null>;
}
