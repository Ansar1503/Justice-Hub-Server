import { IController } from "@interfaces/controller/Interface/IController";
import { FetchReviewsController } from "@interfaces/controller/Client/Reviews/FetchReviewController";
import { FetchReviewUseCase } from "@src/application/usecases/Client/implementations/FetchReviewUseCase";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";

export function FetchReviewsComposer(): IController {
  const usecase = new FetchReviewUseCase(new ReviewRepo());
  return new FetchReviewsController(usecase);
}
