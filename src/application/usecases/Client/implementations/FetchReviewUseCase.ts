import {
  FetchReviewInputDto,
  FetchReviewsOutputDto,
} from "@src/application/dtos/client/FetchReviewDto";
import { IFetchReviewsUseCase } from "../IFetchReviewsUseCase";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";

export class FetchReviewUseCase implements IFetchReviewsUseCase {
  constructor(private reviewRepository: IReviewRepo) {}
  async execute(input: FetchReviewInputDto): Promise<FetchReviewsOutputDto> {
    const reviews = await this.reviewRepository.findByLawyer_id(input);
    return reviews;
  }
}
