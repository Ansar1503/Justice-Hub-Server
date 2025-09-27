import { FetchReviewInputDto, FetchReviewsOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchReviewsUseCase extends IUseCase<FetchReviewInputDto, FetchReviewsOutputDto> {}
