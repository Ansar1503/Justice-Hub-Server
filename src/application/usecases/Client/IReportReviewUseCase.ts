import { ReportReviewInputDto } from "@src/application/dtos/client/ReportReviewDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IReportReviewUseCase
  extends IUseCase<ReportReviewInputDto, void> {}
