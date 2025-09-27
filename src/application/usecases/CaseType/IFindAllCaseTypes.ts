import { CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFindAllCaseTypes extends IUseCase<undefined, CaseTypeDto[] | []> {}
