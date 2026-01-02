"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelereReviewUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class DelereReviewUseCase {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(input) {
        const deletingReview = await this.reviewRepository.findByReview_id(input.review_id);
        if (!deletingReview)
            throw new CustomError_1.ValidationError("review not found");
        deletingReview.deleteReview();
        await this.reviewRepository.update({
            review_id: input.review_id,
            updates: deletingReview,
        });
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
exports.DelereReviewUseCase = DelereReviewUseCase;
