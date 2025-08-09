import { AddReviewInputDto } from "@src/application/dtos/client/AddReviewDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IAddReviewUseCase extends IUseCase<AddReviewInputDto, void> {}
