"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportReviewUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const Disputes_1 = require("@domain/entities/Disputes");
class ReportReviewUseCase {
    reviewRepository;
    disputesRepo;
    constructor(reviewRepository, disputesRepo) {
        this.reviewRepository = reviewRepository;
        this.disputesRepo = disputesRepo;
    }
    async execute(input) {
        const review = await this.reviewRepository.findByReview_id(input.review_id);
        if (!review)
            throw new CustomError_1.ValidationError("review not found");
        const exists = await this.disputesRepo.findByContentId({
            contentId: input.review_id,
        });
        if (exists && Object.keys(exists).length > 0)
            throw new CustomError_1.ValidationError("content already reported");
        const disputesPayload = Disputes_1.Disputes.create({
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
exports.ReportReviewUseCase = ReportReviewUseCase;
