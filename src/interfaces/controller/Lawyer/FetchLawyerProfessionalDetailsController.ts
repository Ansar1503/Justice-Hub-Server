import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchLawyerProfessionalDetails } from "@src/application/usecases/Lawyer/IFetchLawyerProfessionalDetails";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IController } from "../Interface/IController";

export class FetchLawyerProfessionalDetailsController implements IController {
    constructor(
        private _usecase: IFetchLawyerProfessionalDetails,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let userId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            if (typeof httpRequest.params.id === "object") {
                return this._errors.error_400("invalid userid type");
            }
            userId = String(httpRequest.params.id);
        }
        if (!userId) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._usecase.execute(userId);
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
