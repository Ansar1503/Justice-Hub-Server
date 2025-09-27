import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";
import { FetchReviewsList } from "@interfaces/controller/Client/Reviews/FetchReviewsList";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchReviewUseCase } from "@src/application/usecases/Review/implementations/FetchReviewUseCase";

export function FetchReviewsByUserIdComposer(): IController {
    const usecase = new FetchReviewUseCase(new ReviewRepo());
    return new FetchReviewsList(usecase);
}
