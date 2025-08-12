import {
  StartSessionInputDto,
  StartSessionOutputDto,
} from "@src/application/dtos/Lawyer/StartSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IStartSessionUseCase
  extends IUseCase<StartSessionInputDto, StartSessionOutputDto> {}
