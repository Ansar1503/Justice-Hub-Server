import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateReviewsController } from "@interfaces/controller/Client/Reviews/UpdateReviewController";
import { UpdateReviewUseCase } from "@src/application/usecases/Client/implementations/UpdateReviewUseCase";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";

export function UpdateReviewsComposer(): IController {
    const usecase = new UpdateReviewUseCase(new ReviewRepo());
    return new UpdateReviewsController(usecase);
}
