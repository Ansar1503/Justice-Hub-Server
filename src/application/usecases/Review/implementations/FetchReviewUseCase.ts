import { FetchReviewInputDto, FetchReviewOutputDto } from "@src/application/dtos/Reviews/review.dto";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { IFetchReviewUseCase } from "../IFetchReviewUseCase";

export class FetchReviewUseCase implements IFetchReviewUseCase {
    constructor(private _reviewRepo: IReviewRepo) {}
    async execute(input: FetchReviewInputDto): Promise<FetchReviewOutputDto> {
        const review = await this._reviewRepo.findReviewsByUser_id(input);
        return review;
    }
}
