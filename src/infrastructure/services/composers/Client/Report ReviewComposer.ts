import { ReportReviewController } from "@interfaces/controller/Client/ReportReviewController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export const ReportReviewComposer = () => {
  const useCase = ClientUseCaseComposer();
  return new ReportReviewController(useCase);
};
