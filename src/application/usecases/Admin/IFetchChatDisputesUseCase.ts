import {
  FetchChatDisputesInputDto,
  FetchChatDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchChatDisputesDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchChatDisputesUseCase
  extends IUseCase<FetchChatDisputesInputDto, FetchChatDisputesOutputDto> {}
