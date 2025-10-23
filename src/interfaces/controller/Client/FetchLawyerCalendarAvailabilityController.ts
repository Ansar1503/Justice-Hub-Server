import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchLawyerCalendarAvailabilityUseCase } from "@src/application/usecases/Client/IFetchLawyerCalendarAvailabilityUescase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class FetchLawyerCalendarAvailabilityController implements IController {
  constructor(
    private _usecase: IFetchLawyerCalendarAvailabilityUseCase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { lawyerId } = httpRequest.params as Record<string, any>;
    const { month } = httpRequest.query as Record<string, any>;
    if (!lawyerId) return this._errors.error_400("llawyer id is required");
    try {
      const result = await this._usecase.execute({ lawyerId, month });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
