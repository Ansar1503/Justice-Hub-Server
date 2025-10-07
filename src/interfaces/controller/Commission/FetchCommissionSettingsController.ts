import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchCommissionSettingsUsecase } from "@src/application/usecases/Commission/IFetchCommissionSettingsUsecase";

export class FetchCommissionSettingsController implements IController {
  constructor(
    private _fetchCommisionsettings: IFetchCommissionSettingsUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const result = await this._fetchCommisionsettings.execute(null);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
