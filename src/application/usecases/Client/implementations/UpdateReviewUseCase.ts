import {
  UpdateReviewInputDto,
  UpdateReviewOutputDto,
} from "@src/application/dtos/client/UpdateReviewDto";
import { IUpdateReviewUseCase } from "../IUpdateReviewUseCase";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
  constructor(private reviewRepository: IReviewRepo) {}
  async execute(
    input: UpdateReviewInputDto
  ): Promise<UpdateReviewOutputDto | null> {
    const review = await this.reviewRepository.findByReview_id(input.review_id);
    if (!review) throw new ValidationError("review not found");
    const updated = await this.reviewRepository.update(input);
    if (!updated) return null;
    return {
      client_id: updated.clientId,
      createdAt: updated.createdAt,
      heading: updated.heading,
      id: updated.id,
      active: updated.active,
      lawyer_id: updated.lawyerId,
      rating: updated.rating,
      review: updated.review,
      session_id: updated.sessionId,
      updatedAt: updated.updatedAt,
    };
  }
}
