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
    return {
      data: reviews.data.map((d) => ({
        client_id: d.clientId,
        createdAt: d.createdAt,
        heading: d.heading,
        id: d.id,
        lawyer_id: d.lawyerId,
        rating: d.rating,
        review: d.review,
        session_id: d.sessionId,
        updatedAt: d.updatedAt,
      })),
      nextCursor: reviews.nextCursor,
    };
  }
}
