import { ReportReviewController } from "@interfaces/controller/Client/Reviews/ReportReviewController";
import { ReportReviewUseCase } from "@src/application/usecases/Client/implementations/ReportReviewUseCase";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";
import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";

export const ReportReviewComposer = () => {
  const useCase = new ReportReviewUseCase(new ReviewRepo(), new DisputesRepo());
  return new ReportReviewController(useCase);
};
