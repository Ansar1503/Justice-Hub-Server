"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewUseCase = void 0;
class FetchReviewUseCase {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(input) {
        const reviews = await this.reviewRepository.findByLawyer_id(input);
        return reviews;
    }
}
exports.FetchReviewUseCase = FetchReviewUseCase;
