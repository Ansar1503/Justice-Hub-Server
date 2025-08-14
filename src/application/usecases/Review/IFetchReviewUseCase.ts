import { IUseCase } from "../IUseCases/IUseCase";
import {
  FetchReviewInputDto,
  FetchReviewOutputDto,
} from "@src/application/dtos/Reviews/review.dto";

export interface IFetchReviewUseCase
  extends IUseCase<FetchReviewInputDto, FetchReviewOutputDto> {}
