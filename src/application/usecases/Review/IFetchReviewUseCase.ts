import { FetchReviewInputDto, FetchReviewOutputDto } from "@src/application/dtos/Reviews/review.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchReviewUseCase extends IUseCase<FetchReviewInputDto, FetchReviewOutputDto> {}
