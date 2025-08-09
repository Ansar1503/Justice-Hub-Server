import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IChangeLawyerVerificationStatus } from "@src/application/usecases/Admin/IChangeLawyerVerificationStatus";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class ChangeLawyerVerificationStatusController implements IController {
  constructor(
    private ChangeLawyerVerificationUseCase: IChangeLawyerVerificationStatus,
    private httpError: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { user_id, status, rejectReason } = httpRequest.body as Record<
      string,
      any
    >;
    if (!user_id) {
      const error = this.httpError.error_400();
      return new HttpResponse(error.statusCode, "UserId not found");
    }
    if (
      !status ||
      !["verified", "rejected", "pending", "requested"].includes(status)
    ) {
      const error = this.httpError.error_400();
      return new HttpResponse(
        error.statusCode,
        "Status not found or Invalid status"
      );
    }
    const result = await this.ChangeLawyerVerificationUseCase.execute({
      user_id,
      status,
      rejectReason,
    });
    if (!result) {
      const error = this.httpError.error_400();
      return new HttpResponse(error.statusCode, error.body);
    } else {
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    }
  }
}
