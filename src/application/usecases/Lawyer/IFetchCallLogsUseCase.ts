import {
  FetchCallLogsInputDto,
  FetchCallLogsOutputDto,
} from "@src/application/dtos/Lawyer/FetchCallLogsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchCallLogsUseCase
  extends IUseCase<FetchCallLogsInputDto, FetchCallLogsOutputDto> {}
