import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/Lawyer/FetchSessionsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchSessionUseCase
  extends IUseCase<FetchSessionsInputDto, FetchSessionsOutputtDto> {}
