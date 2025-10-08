import { IAddSessionSummaryUsecase } from "@src/application/usecases/Case/Interfaces/IAddSessionSummaryUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class AddSessionSummaryController implements IController {
  constructor(
    private _addSessionSummary: IAddSessionSummaryUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let sessionId = "";
    let summary = "";
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("sessionId" in httpRequest.body) {
        sessionId = String(httpRequest.body.sessionId);
      }
      if ("summary" in httpRequest.body) {
        summary = String(httpRequest.body.summary);
      }
    }
    if (!sessionId.trim()) return this._errors.error_400("no session id found");
    if (!summary.trim()) return this._errors.error_400("no summary found");

    try {
      const result = await this._addSessionSummary.execute({
        sessionId,
        summary,
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
