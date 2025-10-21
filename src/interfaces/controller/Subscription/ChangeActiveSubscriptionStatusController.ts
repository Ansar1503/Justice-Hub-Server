import { IChangeActiveSubscriptionStatusUsecase } from "@src/application/usecases/Subscription/IDeactivateSubscriptionUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class ChangeActiveSubscriptionStatusController implements IController {
  constructor(
    private _changeActiveSubscriptionStatus: IChangeActiveSubscriptionStatusUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const id =
      httpRequest?.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
        ? String(httpRequest.params.id)
        : null;

    const status =
      httpRequest?.body &&
      typeof httpRequest.body === "object" &&
      "status" in httpRequest.body &&
      typeof httpRequest.body.status === "boolean"
        ? httpRequest.body.status
        : null;

    if (!id) {
      return this._errors.error_400("Subscription ID is required");
    }

    if (status === null) {
      return this._errors.error_400("Status is required");
    }
    try {
      const result = await this._changeActiveSubscriptionStatus.execute({
        id,
        status,
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
