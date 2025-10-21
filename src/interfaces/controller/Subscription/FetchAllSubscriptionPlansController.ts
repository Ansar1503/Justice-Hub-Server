import { IFetchAllSubsrciptionPlansUsecase } from "@src/application/usecases/Subscription/IFetchAllSubsrciptionPlansUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class FetchAllSubscriptionPlansController implements IController {
  constructor(
    private _fetchAllSubscriptionPlans: IFetchAllSubsrciptionPlansUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
      try {
        const result =  await this._fetchAllSubscriptionPlans.execute()
        return this._success.success_200(result)
      } catch (error) {
        if(error instanceof Error){
            return this._errors.error_400(error.message)
        }
        return this._errors.error_500()
      }
  }
}
