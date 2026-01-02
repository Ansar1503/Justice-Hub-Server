"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReviewUseCase = void 0;
const Review_1 = require("@domain/entities/Review");
class AddReviewUseCase {
    userRepository;
    lawyerRepository;
    reviewRepository;
    constructor(userRepository, lawyerRepository, reviewRepository) {
        this.userRepository = userRepository;
        this.lawyerRepository = lawyerRepository;
        this.reviewRepository = reviewRepository;
    }
    async execute(input) {
        const user = await this.userRepository.findByuser_id(input.client_id);
        if (!user)
            throw new Error("USER_EMPTY");
        if (!user.is_verified)
            throw new Error("USER_UNVERIFIED");
        if (user.is_blocked)
            throw new Error("USER_BLOCKED");
        const lawyer = await this.lawyerRepository.findByUserId(input.lawyer_id);
        if (!lawyer)
            throw new Error("LAWYER_EMPTY");
        if (lawyer.verificationStatus !== "verified")
            throw new Error("LAWYER_UNVERIFIED");
        const existingReview = await this.reviewRepository.findBySession_id(input.session_id);
        // console.log(existingReview);
        if (existingReview && existingReview.length > 5) {
            throw new Error("REVIEW_LIMIT_EXCEEDED");
        }
        try {
            const reviewpayload = Review_1.Review.create(input);
            await this.reviewRepository.create(reviewpayload);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.AddReviewUseCase = AddReviewUseCase;
