import { IGenerateSalesReport } from "@src/application/usecases/Admin/IGenerateSalesReport";
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class DownloadSalesReportController implements IController {
  constructor(
    private readonly usecase: IGenerateSalesReport,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const { startDate, endDate, format } = httpRequest.query as Record<
        string,
        string
      >;

      if (!startDate || !endDate || !format) {
        return this._errors.error_400("Invalid credentials");
      }

      const result = await this.usecase.execute({
        startDate,
        endDate,
        format,
      });
      const base64 = result.buffer.toString("base64");

      return this._success.success_200({
        file: base64,
        mimeType: result.mimeType,
        filename: result.filename,
      });
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
