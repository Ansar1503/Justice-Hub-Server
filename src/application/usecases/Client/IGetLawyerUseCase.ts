import {
  GetLawyersInputDto,
  GetLawyersOutputDto,
} from "@src/application/dtos/client/GetLawyersDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IGetLawyersUseCase
  extends IUseCase<GetLawyersInputDto, GetLawyersOutputDto> {}
