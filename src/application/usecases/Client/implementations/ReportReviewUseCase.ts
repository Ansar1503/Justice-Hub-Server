import { ReportReviewInputDto } from "@src/application/dtos/client/ReportReviewDto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { Disputes } from "@domain/entities/Disputes";
import { IReportReviewUseCase } from "../IReportReviewUseCase";

export class ReportReviewUseCase implements IReportReviewUseCase {
    constructor(
        private _reviewRepository: IReviewRepo,
        private _disputesRepo: IDisputes,
    ) {}
    async execute(input: ReportReviewInputDto): Promise<void> {
        const review = await this._reviewRepository.findByReview_id(input.review_id);
        if (!review) throw new ValidationError("review not found");

        const exists = await this._disputesRepo.findByContentId({
            contentId: input.review_id,
        });
        if (exists && Object.keys(exists).length > 0) throw new ValidationError("content already reported");

        const disputesPayload = Disputes.create({
            contentId: input.review_id,
            disputeType: "reviews",
            reason: input.reason,
            reportedBy: input.reportedBy,
            reportedUser: input.reportedUser,
            status: "pending",
        });

        await this._disputesRepo.create(disputesPayload);
    }
}
