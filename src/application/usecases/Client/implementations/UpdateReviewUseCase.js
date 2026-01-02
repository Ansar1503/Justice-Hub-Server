"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class UpdateReviewUseCase {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(input) {
        const review = await this.reviewRepository.findByReview_id(input.review_id);
        if (!review)
            throw new CustomError_1.ValidationError("review not found");
        const updated = await this.reviewRepository.update(input);
        if (!updated)
            return null;
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
exports.UpdateReviewUseCase = UpdateReviewUseCase;
