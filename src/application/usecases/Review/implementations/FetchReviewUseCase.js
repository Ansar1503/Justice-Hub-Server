"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewUseCase = void 0;
class FetchReviewUseCase {
    reviewRepo;
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    async execute(input) {
        const review = await this.reviewRepo.findReviewsByUser_id(input);
        return review;
    }
}
exports.FetchReviewUseCase = FetchReviewUseCase;
