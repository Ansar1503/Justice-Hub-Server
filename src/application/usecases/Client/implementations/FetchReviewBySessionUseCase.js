"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewBySessionUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class FetchReviewBySessionUseCase {
    sessionRepo;
    reviewRepository;
    constructor(sessionRepo, reviewRepository) {
        this.sessionRepo = sessionRepo;
        this.reviewRepository = reviewRepository;
    }
    async execute(input) {
        const session = await this.sessionRepo.findById(input);
        if (!session)
            throw new CustomError_1.ValidationError("Session not found");
        const reviews = await this.reviewRepository.findBySession_id(input.session_id);
        return reviews;
    }
}
exports.FetchReviewBySessionUseCase = FetchReviewBySessionUseCase;
