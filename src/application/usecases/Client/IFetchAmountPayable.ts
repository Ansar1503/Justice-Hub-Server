import {
  FetchAmountPayableInputDto,
  FetchAmountPayableOutputDto,
} from "@src/application/dtos/client.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAmountPayable
  extends IUseCase<FetchAmountPayableInputDto, FetchAmountPayableOutputDto> {}
