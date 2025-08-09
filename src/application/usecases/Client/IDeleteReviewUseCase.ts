import { UpdateReviewOutputDto } from "@src/application/dtos/client/UpdateReviewDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IDeleteReviewUseCase
  extends IUseCase<{ review_id: string }, UpdateReviewOutputDto> {}
