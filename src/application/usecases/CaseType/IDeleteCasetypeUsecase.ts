import { CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeleteCasetypeUsecase extends IUseCase<string, CaseTypeDto> {}
