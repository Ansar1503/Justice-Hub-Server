import { FetchReviewsBySessionOutputDto } from "@src/application/dtos/client/FetchReviewDto";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IFetchReviewsBySessionUseCase } from "../IFetchReviewsBySessionUseCase";

export class FetchReviewBySessionUseCase implements IFetchReviewsBySessionUseCase {
    constructor(
        private _sessionRepo: ISessionsRepo,
        private _reviewRepository: IReviewRepo,
    ) {}
    async execute(input: { session_id: string }): Promise<FetchReviewsBySessionOutputDto[]> {
        const session = await this._sessionRepo.findById(input);
        if (!session) throw new ValidationError("Session not found");
        const reviews = await this._reviewRepository.findBySession_id(input.session_id);
        return reviews;
    }
}
