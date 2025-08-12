import {
  GetLawyersInputDto,
  GetLawyersOutputDto,
} from "@src/application/dtos/client/GetLawyersDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IGetLawyersUseCase
  extends IUseCase<GetLawyersInputDto, GetLawyersOutputDto> {}
