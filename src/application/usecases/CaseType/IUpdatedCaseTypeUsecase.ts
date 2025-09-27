import { CaseTypeDto, UpdateCasetypeInputDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateCaseTypeUsecase extends IUseCase<UpdateCasetypeInputDto, CaseTypeDto> {}
