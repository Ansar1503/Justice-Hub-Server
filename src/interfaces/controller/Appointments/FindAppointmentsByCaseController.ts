import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFindAppointmentsByCaseUsecase } from "@src/application/usecases/Appointments/IFindAppointmentsByCaseUsecase";

export class FindAppointmentByCaseController implements IController {
    constructor(
    private _findAppointmentByCase: IFindAppointmentsByCaseUsecase,
    private _error: IHttpErrors,
    private _success: IHttpSuccess
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let caseId = "";
        if (
            httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
        ) {
            caseId = String(httpRequest.params.id);
        }
        if (!caseId) return this._error.error_400("case id is required");
        try {
            const result = await this._findAppointmentByCase.execute(caseId);
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._error.error_400(error.message);
            }
            return this._error.error_500();
        }
    }
}
