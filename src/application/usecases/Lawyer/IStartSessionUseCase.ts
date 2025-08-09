import {
  StartSessionInputDto,
  StartSessionOutputDto,
} from "@src/application/dtos/Lawyer/StartSessionDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IStartSessionUseCase
  extends IUseCase<StartSessionInputDto, StartSessionOutputDto> {}
