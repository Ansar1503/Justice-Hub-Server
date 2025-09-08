import {
  CasetypeFetchQueryDto,
  CaseTypeFetchResultDto,
} from "@src/application/dtos/CaseType/CaseTypeDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFechAllCasetypeUsecase
  extends IUseCase<CasetypeFetchQueryDto, CaseTypeFetchResultDto> {}
