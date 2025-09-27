import {
    AddCasetypeInputDto,
    CaseTypeDto,
} from "@src/application/dtos/CaseType/CaseTypeDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddCasetypeUsecase
  extends IUseCase<AddCasetypeInputDto, CaseTypeDto> {}
