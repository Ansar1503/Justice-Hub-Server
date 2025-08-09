import { IController } from "@interfaces/controller/Interface/IController";
import { AddReviewController } from "@interfaces/controller/Client/Reviews/AddReviewController";
import { AddReviewUseCase } from "@src/application/usecases/Client/implementations/AddReviewUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";

export function AddReviewComposer(): IController {
  const usecase = new AddReviewUseCase(
    new UserRepository(),
    new LawyerRepository(),
    new ReviewRepo()
  );
  return new AddReviewController(usecase);
}
