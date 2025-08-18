import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IController } from "../Interface/IController";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IUpdateDisputesStatusUseCase } from "@src/application/usecases/Admin/IUpdateDisputesStatusUseCase";

export class ChangeDisputesStatusController implements IController {
  constructor(
    private changeDisputesStatus: IUpdateDisputesStatusUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpError: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let dispute_id: string = "";
    let action: "deleted" | "blocked" | "" = "";
    let status: "pending" | "resolved" | "rejected" | "" = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      dispute_id = String(httpRequest.params.id);
    }
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if (
        "action" in httpRequest.body &&
        typeof httpRequest.body.action === "string"
      ) {
        if (httpRequest.body.action === "deleted") {
          action = httpRequest.body.action;
        } else if (httpRequest.body.action === "blocked") {
          action = httpRequest.body.action;
        }
      }
      if (
        "status" in httpRequest.body &&
        typeof httpRequest.body.status === "string"
      ) {
        if (httpRequest.body.status === "pending") {
          status = httpRequest.body.status;
        } else if (httpRequest.body.status === "resolved") {
          status = httpRequest.body.status;
        } else if (httpRequest.body.status === "rejected") {
          status = httpRequest.body.status;
        }
      }
    }
    if (!dispute_id) {
      return this.httpError.error_400("id is required");
    }
    if (!action) {
      return this.httpError.error_400("action is required");
    }
    if (!status) {
      return this.httpError.error_400("status is required");
    }
    try {
      const result = await this.changeDisputesStatus.execute({
        action,
        disputesId: dispute_id,
        status,
      });
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpError.error_400(error.message);
      }
      return this.httpError.error_500("An error occurred");
    }
  }
}
