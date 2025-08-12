import { FetchReviewsBySessionOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchReviewsBySessionUseCase
  extends IUseCase<
    {
      session_id: string;
    },
    FetchReviewsBySessionOutputDto[]
  > {}
