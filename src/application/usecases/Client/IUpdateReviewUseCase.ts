import { UpdateReviewInputDto, UpdateReviewOutputDto } from "@src/application/dtos/client/UpdateReviewDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IUpdateReviewUseCase
  extends IUseCase<UpdateReviewInputDto, UpdateReviewOutputDto | null> {}
