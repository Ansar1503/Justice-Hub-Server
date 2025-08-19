import { UpdateReviewOutputDto } from "@src/application/dtos/client/UpdateReviewDto";
import { IDeleteReviewUseCase } from "../IDeleteReviewUseCase";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";

export class DelereReviewUseCase implements IDeleteReviewUseCase {
  constructor(private reviewRepository: IReviewRepo) {}
  async execute(input: { review_id: string }): Promise<UpdateReviewOutputDto> {
    const deletingReview = await this.reviewRepository.findByReview_id(
      input.review_id
    );
    if (!deletingReview) throw new ValidationError("review not found");
    await this.reviewRepository.delete(input.review_id);
    return {
      client_id: deletingReview.clientId,
      createdAt: deletingReview.createdAt,
      heading: deletingReview.heading,
      id: deletingReview.id,
      active: deletingReview.active,
      lawyer_id: deletingReview.lawyerId,
      rating: deletingReview.rating,
      review: deletingReview.review,
      session_id: deletingReview.sessionId,
      updatedAt: deletingReview.updatedAt,
    };
  }
}
