import { IController } from "@interfaces/controller/Interface/IController";
import { AddReviewController } from "@interfaces/controller/Client/Reviews/AddReviewController";
import { AddReviewUseCase } from "@src/application/usecases/Client/implementations/AddReviewUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

export function AddReviewComposer(): IController {
  const usecase = new AddReviewUseCase(
    new UserRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper()),
    new ReviewRepo()
  );
  return new AddReviewController(usecase);
}
