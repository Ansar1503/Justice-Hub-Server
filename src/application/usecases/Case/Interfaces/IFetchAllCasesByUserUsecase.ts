import { CaseDto } from "@src/application/dtos/Cases/CasesDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchAllCasesByUserUsecase
  extends IUseCase<string, CaseDto[] | []> {}
