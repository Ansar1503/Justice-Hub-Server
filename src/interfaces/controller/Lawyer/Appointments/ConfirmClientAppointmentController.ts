import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IConfirmAppointmentUseCase } from "@src/application/usecases/Lawyer/IConfirmAppointmentUseCase";

export class ConfirmClientAppointment implements IController {
  constructor(
    private confirmAppointment: IConfirmAppointmentUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let id: string = "";
    let status:
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected"
      | "" = "";
    if (!httpRequest.body) {
      return this.httpErrors.error_400("Invalid query");
    }
    if (typeof httpRequest.body === "object" && "id" in httpRequest.body) {
      id = String(httpRequest.body.id);
    }
    if (typeof httpRequest.body === "object" && "status" in httpRequest.body) {
      if (
        httpRequest.body.status === "confirmed" ||
        httpRequest.body.status === "pending" ||
        httpRequest.body.status === "completed" ||
        httpRequest.body.status === "cancelled" ||
        httpRequest.body.status === "rejected"
      ) {
        status = httpRequest.body.status;
      }
    }
    if (!id || !status) {
      return this.httpErrors.error_400("Invalid Credentials");
    }
    try {
      const result = await this.confirmAppointment.execute({
        id,
        status,
      });
      return this.httpSuccess.success_200({
        success: true,
        message: "session created",
        data: result,
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        "message" in error
      ) {
        const statusCode =
          typeof error?.code === "number" &&
          error.code >= 100 &&
          error.code < 600
            ? error.code
            : 500;
        return new HttpResponse(statusCode, { message: error.message });
      }
      return this.httpErrors.error_500();
    }
  }
}
