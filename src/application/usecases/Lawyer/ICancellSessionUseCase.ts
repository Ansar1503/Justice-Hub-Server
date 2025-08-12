import {
  CancelSessionInputDto,
  CancelSessionOutputDto,
} from "@src/application/dtos/Lawyer/CancelSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICancelSessionUseCase
  extends IUseCase<CancelSessionInputDto, CancelSessionOutputDto> {}
