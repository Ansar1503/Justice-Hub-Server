import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFindCaseDetailsUsecase } from "@src/application/usecases/Case/Interfaces/IFindCaseDetailsUsecase";
import { IController } from "../Interface/IController";

export class FetchCaseDetailsControlller implements IController {
    constructor(
        private _findCaseDetailsUsecase: IFindCaseDetailsUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let caseId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            caseId = String(httpRequest.params.id);
        }
        if (!caseId?.trim()) {
            return this._errors.error_400("caseId not found");
        }
        try {
            const result = await this._findCaseDetailsUsecase.execute(caseId);
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
