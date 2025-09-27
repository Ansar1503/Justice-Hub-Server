import { FetchReviewInputDto, FetchReviewOutputDto } from "@src/application/dtos/Reviews/review.dto";
import { FetchReviewsBySessionOutputDto, FetchReviewsOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { Review } from "../entities/Review";
export interface IReviewRepo {
    create(payload: Review): Promise<Review>;
    update(payload: { review_id: string; updates: Partial<Review> }): Promise<Review | null>;
    findByLawyer_id(payload: { lawyer_id: string; page: number }): Promise<FetchReviewsOutputDto>;
    findBySession_id(session_id: string): Promise<FetchReviewsBySessionOutputDto[] | []>;
    findByReview_id(id: string): Promise<Review | null>;
    findReviewsByUser_id(payload: FetchReviewInputDto): Promise<FetchReviewOutputDto>;
}
