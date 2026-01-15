import { Case } from "@domain/entities/Case";
import {
  AggregatedCasesData,
  FetchCaseQueryType,
  FindCasesWithPagination,
} from "@src/application/dtos/Cases/FindCasesByQueryDto";
import { IBaseRepository } from "./IBaseRepo";

export interface ICaseRepo extends IBaseRepository<Case> {
  findByQuery(
    payload: FetchCaseQueryType & { userId: string }
  ): Promise<FindCasesWithPagination>;
  findById(id: string): Promise<AggregatedCasesData | null>;
  findByCaseTypes(payload: {
    lawyerId:string
    userId: string;
    caseTypeIds: string[];
  }): Promise<Case[] | []>;
  findAllByUser(userId: string): Promise<Case[] | []>;
  countOpen(): Promise<number>;
  getCaseTrends(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; cases: number }[]>;
  update(caseId: string, data: Partial<Case>): Promise<Case | null>
}
