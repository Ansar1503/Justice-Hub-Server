import { FetchReviewsBySessionOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { IFetchReviewsBySessionUseCase } from "../IFetchReviewsBySessionUseCase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

export class FetchReviewBySessionUseCase
  implements IFetchReviewsBySessionUseCase
{
  constructor(
    private sessionRepo: ISessionsRepo,
    private reviewRepository: IReviewRepo
  ) {}
  async execute(input: {
    session_id: string;
  }): Promise<FetchReviewsBySessionOutputDto[]> {
    const session = await this.sessionRepo.findById(input);
    if (!session) throw new ValidationError("Session not found");
    const reviews = await this.reviewRepository.findBySession_id(
      input.session_id
    );
    return reviews.map((r) => ({
      client_id: r.clientId,
      createdAt: r.createdAt,
      heading: r.heading,
      id: r.id,
      lawyer_id: r.lawyerId,
      active: r.active,
      rating: r.rating,
      review: r.review,
      reviewedBy: r.reviewedBy,
      session_id: r.sessionId,
      updatedAt: r.updatedAt,
    }));
  }
}
