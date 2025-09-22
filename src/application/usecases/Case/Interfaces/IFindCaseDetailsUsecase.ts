import { AggregatedCasesData } from "@src/application/dtos/Cases/FindCasesByQueryDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFindCaseDetailsUsecase extends IUseCase<string, AggregatedCasesData> {}
