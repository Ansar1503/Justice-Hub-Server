import { FetchReviewInputDto, FetchReviewsOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { IFetchReviewsUseCase } from "../IFetchReviewsUseCase";

export class FetchReviewUseCase implements IFetchReviewsUseCase {
    constructor(private _reviewRepository: IReviewRepo) {}
    async execute(input: FetchReviewInputDto): Promise<FetchReviewsOutputDto> {
        const reviews = await this._reviewRepository.findByLawyer_id(input);
        return reviews;
    }
}
