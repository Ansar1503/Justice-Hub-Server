import {
  FetchReviewInputDto,
  FetchReviewOutputDto,
} from "@src/application/dtos/Reviews/review.dto";
import { IFetchReviewUseCase } from "../IFetchReviewUseCase";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";

export class FetchReviewUseCase implements IFetchReviewUseCase {
  constructor(private reviewRepo: IReviewRepo) {}
  async execute(input: FetchReviewInputDto): Promise<FetchReviewOutputDto> {
    const review = await this.reviewRepo.findReviewsByUser_id(input);
    return review;
  }
}
