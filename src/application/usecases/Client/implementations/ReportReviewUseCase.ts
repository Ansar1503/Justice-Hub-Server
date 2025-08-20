import { ReportReviewInputDto } from "@src/application/dtos/client/ReportReviewDto";
import { IReportReviewUseCase } from "../IReportReviewUseCase";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { Disputes } from "@domain/entities/Disputes";

export class ReportReviewUseCase implements IReportReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepo,
    private disputesRepo: IDisputes
  ) {}
  async execute(input: ReportReviewInputDto): Promise<void> {
    const review = await this.reviewRepository.findByReview_id(input.review_id);
    if (!review) throw new ValidationError("review not found");

    const exists = await this.disputesRepo.findByContentId({
      contentId: input.review_id,
    });
    if (exists && Object.keys(exists).length > 0)
      throw new ValidationError("content already reported");

    const disputesPayload = Disputes.create({
      contentId: input.review_id,
      disputeType: "reviews",
      reason: input.reason,
      reportedBy: input.reportedBy,
      reportedUser: input.reportedUser,
      status: "pending",
    });

    await this.disputesRepo.create(disputesPayload);
  }
}
