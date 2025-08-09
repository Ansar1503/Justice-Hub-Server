import { FetchClientDto } from "@src/application/dtos/client/FetchClientDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchClientDataUseCase
  extends IUseCase<string, FetchClientDto> {}
