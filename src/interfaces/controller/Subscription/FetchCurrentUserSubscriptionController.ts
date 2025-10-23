import { IFetchCurrentUserSubscriptionUsecase } from "@src/application/usecases/Subscription/IFetchCurrentUseSubscription";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class FetchCurrentUserSubscriptionController implements IController {
  constructor(
    private _fetchUserSubscription: IFetchCurrentUserSubscriptionUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userID = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userID = String(httpRequest.user.id);
    }
    if (!userID) return this._errors.error_400("user id not found");
    try {
      const resuls = await this._fetchUserSubscription.execute(userID);
      return this._success.success_200(resuls);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
