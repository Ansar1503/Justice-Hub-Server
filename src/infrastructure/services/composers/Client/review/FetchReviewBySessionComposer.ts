import { IController } from "@interfaces/controller/Interface/IController";
import { FetchReviewsBySessionController } from "@interfaces/controller/Client/Reviews/FetchReviewBySessionController";
import { FetchReviewBySessionUseCase } from "@src/application/usecases/Client/implementations/FetchReviewBySessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";

export function FetchReviewsBySessionComposer(): IController {
    const usecase = new FetchReviewBySessionUseCase(
        new SessionsRepository(),
        new ReviewRepo()
    );
    return new FetchReviewsBySessionController(usecase);
}
