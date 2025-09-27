import { IDeleteCasetypeUsecase } from "@src/application/usecases/CaseType/IDeleteCasetypeUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class DeleteCaseTypeController implements IController {
    constructor(
        private _deleteUsecase: IDeleteCasetypeUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this._errors.error_400("id is requierd");
        }
        try {
            const result = await this._deleteUsecase.execute(id);
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
