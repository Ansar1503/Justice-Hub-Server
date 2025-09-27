import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFindAllCaseTypes } from "@src/application/usecases/CaseType/IFindAllCaseTypes";
import { IController } from "../Interface/IController";

export class FindAllCaseTypes implements IController {
    constructor(
        private _findCaseTypes: IFindAllCaseTypes,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        try {
            const res = await this._findCaseTypes.execute(undefined);
            return this._success.success_200(res);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
