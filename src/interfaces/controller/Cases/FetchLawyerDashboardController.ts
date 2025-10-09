import { IFetchLawyerDashboardDataUsecase } from "@src/application/usecases/Case/Interfaces/IFetchLawyerDashboardData";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class FetchLawyerDashboardDataController implements IController {
  constructor(
    private _fetchLawyerDashboardData: IFetchLawyerDashboardDataUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    if (!userId) {
      return this._errors.error_400("user id not found");
    }
    try {
      const result = await this._fetchLawyerDashboardData.execute(userId);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
