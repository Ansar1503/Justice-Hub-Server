import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchReviewDisputesUseCase
  extends IUseCase<FetchReviewDisputesInputDto, FetchReviewDisputesOutputDto> {}
