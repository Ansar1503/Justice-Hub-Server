import { IFetchDashboardDataUsecase } from "@src/application/usecases/Admin/IFetchDashboardDataUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class FetchAdminDashboardDataController implements IController {
  constructor(
    private _fetchDashboardData: IFetchDashboardDataUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const query = httpRequest.query as Record<string, string | undefined>;
    const { startDate, endDate } = query;

    if (!startDate || !endDate) {
      return this._errors.error_400(
        "startDate and endDate are required query parameters"
      );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this._errors.error_400(
        "Invalid date format. Use ISO format (YYYY-MM-DD)"
      );
    }
    try {
      const data = await this._fetchDashboardData.execute({ start, end });
      return this._success.success_200(data);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
