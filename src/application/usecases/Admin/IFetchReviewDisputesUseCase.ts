import {
    FetchReviewDisputesInputDto,
    FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchReviewDisputesUseCase
  extends IUseCase<FetchReviewDisputesInputDto, FetchReviewDisputesOutputDto> {}
