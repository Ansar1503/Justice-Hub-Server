import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpRequest } from "@interfaces/helpers/IHttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IReportReviewUseCase } from "@src/application/usecases/Client/IReportReviewUseCase";

export class ReportReviewController implements IController {
    constructor(
    private readonly reportReviewUseCase: IReportReviewUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id: review_id } = httpRequest.params as { id: string };
            const { reason, reportedBy, reportedUser } = httpRequest.body as {
        reason: string;
        reportedBy: string;
        reportedUser: string;
      };

            if (!review_id || review_id.trim() === "") {
                return this.httpErrors.error_400("reviewId required");
            }
            if (!reason || reason.trim() === "") {
                return this.httpErrors.error_400("reason required");
            }
            if (!reportedBy || reportedBy.trim() === "") {
                return this.httpErrors.error_400("reportedBy required");
            }
            if (!reportedUser || reportedUser.trim() === "") {
                return this.httpErrors.error_400("reportedUser required");
            }

            await this.reportReviewUseCase.execute({
                review_id,
                reason,
                reportedBy,
                reportedUser,
            });

            return this.httpSuccess.success_200({
                success: true,
                message: "Review reported ",
            });
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Something went wrong");
        }
    }
}
