import { ISubscribePlanUsecase } from "@src/application/usecases/Subscription/ISubscribePlanUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class SubscribePlanController implements IController {
  constructor(
    private _subscribePlan: ISubscribePlanUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let planId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    if (
      httpRequest.body &&
      typeof httpRequest.body === "object" &&
      "planId" in httpRequest.body
    ) {
      planId = String(httpRequest.body.planId);
    }
    if (!userId || !planId) {
      return this._errors.error_400("Invalid Credentials");
    }
    try {
      const result = await this._subscribePlan.execute({ planId, userId });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
