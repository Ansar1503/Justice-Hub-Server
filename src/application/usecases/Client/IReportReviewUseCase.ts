import { ReportReviewInputDto } from "@src/application/dtos/client/ReportReviewDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IReportReviewUseCase
  extends IUseCase<ReportReviewInputDto, void> {}
