import {
  UseCaseInputDto,
  UseCaseOutputDto,
} from "@src/application/dtos/Admin/FetchLawyersDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchLawyerUseCase
  extends IUseCase<UseCaseInputDto, UseCaseOutputDto> {}
