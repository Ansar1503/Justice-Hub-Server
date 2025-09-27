import { IFetchCaseSessionsUsecase } from "@src/application/usecases/Case/Interfaces/IFetchCaseSessionsUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class FetchCaseSessionController implements IController {
    constructor(
        private _fetchCaseSessions: IFetchCaseSessionsUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let CaseId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            CaseId = String(httpRequest.params.id);
        }
        if (!CaseId) return this._errors.error_400("case id not found");
        try {
            const result = await this._fetchCaseSessions.execute(CaseId);
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
