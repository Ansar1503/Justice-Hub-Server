import {
  FetchReviewInputDto,
  FetchReviewsOutputDto,
} from "@src/application/dtos/client/FetchReviewDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchReviewsUseCase
  extends IUseCase<FetchReviewInputDto, FetchReviewsOutputDto> {}
