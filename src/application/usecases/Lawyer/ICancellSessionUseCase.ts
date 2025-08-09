import {
  CancelSessionInputDto,
  CancelSessionOutputDto,
} from "@src/application/dtos/Lawyer/CancelSessionDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface ICancelSessionUseCase
  extends IUseCase<CancelSessionInputDto, CancelSessionOutputDto> {}
