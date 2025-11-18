import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchAmountPayable } from "@src/application/usecases/Client/IFetchAmountPayable";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class FetchAmountPayableController implements IController {
  constructor(
    private _fetchAmountPayable: IFetchAmountPayable,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let lawyerId = "";
    let type: "consultation" | "follow-up" = "consultation";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      lawyerId = String(httpRequest.params.id);
    }
    if (
      httpRequest.query &&
      typeof httpRequest.query === "object" &&
      "type" in httpRequest.query
    ) {
      if (typeof httpRequest.query.type === "string") {
        if (httpRequest.query.type === "follow-up") {
          type = httpRequest.query.type;
        }
      }
    }
    try {
      const result = await this._fetchAmountPayable.execute({
        appointmentType: type,
        clientId: userId,
        lawyerId: lawyerId,
      });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
