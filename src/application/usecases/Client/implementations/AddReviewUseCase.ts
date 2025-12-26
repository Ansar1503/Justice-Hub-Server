import { AddReviewInputDto } from "@src/application/dtos/client/AddReviewDto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { Review } from "@domain/entities/Review";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IAddReviewUseCase } from "../IAddReviewUseCase";

export class AddReviewUseCase implements IAddReviewUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _lawyerRepository: ILawyerVerificationRepo,
        private _reviewRepository: IReviewRepo,
    ) {}
    async execute(input: AddReviewInputDto): Promise<void> {
        const user = await this._userRepository.findByuser_id(input.client_id);
        if (!user) throw new Error("USER_EMPTY");
        if (!user.is_verified) throw new Error("USER_UNVERIFIED");
        if (user.is_blocked) throw new Error("USER_BLOCKED");
        const lawyer = await this._lawyerRepository.findByUserId(input.lawyer_id);
        if (!lawyer) throw new Error("LAWYER_EMPTY");
        if (lawyer.verificationStatus !== "verified") throw new Error("LAWYER_UNVERIFIED");

        const existingReview = await this._reviewRepository.findBySession_id(input.session_id);
        // console.log(existingReview);
        if (existingReview && existingReview.length > 5) {
            throw new Error("REVIEW_LIMIT_EXCEEDED");
        }

        try {
            const reviewpayload = Review.create(input);
            await this._reviewRepository.create(reviewpayload);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
