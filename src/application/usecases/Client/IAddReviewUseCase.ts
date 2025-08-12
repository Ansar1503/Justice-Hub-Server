import { AddReviewInputDto } from "@src/application/dtos/client/AddReviewDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddReviewUseCase extends IUseCase<AddReviewInputDto, void> {}
