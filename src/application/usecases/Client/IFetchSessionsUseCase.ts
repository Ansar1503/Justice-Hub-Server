import {
  FetchSessionOutputDto,
  FetchSessionsInputDto,
} from "@src/application/dtos/client/FetchSessionsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchSessionsUseCase
  extends IUseCase<FetchSessionsInputDto, FetchSessionOutputDto> {}
