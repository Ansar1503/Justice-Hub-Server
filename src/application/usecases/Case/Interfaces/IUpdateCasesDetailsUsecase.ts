import { CaseDto, UpdateCaseDto } from "@src/application/dtos/Cases/CasesDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IUpdateCasesDetailsUsecase extends IUseCase<UpdateCaseDto, CaseDto> {

}