import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpRequest } from "@interfaces/helpers/IHttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";

export class ReportReviewController implements IController {
  constructor(
    private readonly clientUseCase: I_clientUsecase,
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

      await this.clientUseCase.reportReview({
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
      console.error("ReportReviewController Error:", error);
      return this.httpErrors.error_500("Something went wrong");
    }
  }
}
