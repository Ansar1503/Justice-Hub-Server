import { IController } from "@interfaces/controller/Interface/IController";
import { DeleteReviewController } from "@interfaces/controller/Client/Reviews/DeleteReviewController";
import { DelereReviewUseCase } from "@src/application/usecases/Client/implementations/DeleteReviewUseCase";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";

export function DeleteReviewComposer(): IController {
  const usecase = new DelereReviewUseCase(new ReviewRepo());
  return new DeleteReviewController(usecase);
}
