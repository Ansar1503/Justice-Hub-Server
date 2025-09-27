import { UpdateReviewOutputDto } from "@src/application/dtos/client/UpdateReviewDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeleteReviewUseCase extends IUseCase<{ review_id: string }, UpdateReviewOutputDto> {}
