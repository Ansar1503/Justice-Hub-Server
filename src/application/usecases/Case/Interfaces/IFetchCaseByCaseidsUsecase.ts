import { CaseDto } from "@src/application/dtos/Cases/CasesDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchCaseByCaseTypeIdsUsecase
  extends IUseCase<{ userId: string;lawyerId:string, caseTypeIds: string[] }, CaseDto[]> {}
