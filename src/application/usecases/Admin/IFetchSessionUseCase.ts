import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/sessions/FetchSessionsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchSessionUseCase
  extends IUseCase<FetchSessionsInputDto, FetchSessionsOutputtDto> {}
