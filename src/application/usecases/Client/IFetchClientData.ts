import { FetchClientDto } from "@src/application/dtos/client/FetchClientDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchClientDataUseCase
  extends IUseCase<string, FetchClientDto> {}
