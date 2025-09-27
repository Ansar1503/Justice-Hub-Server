import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFindCaseTypesByPracticeAreas } from "@src/application/usecases/CaseType/IFetchCasesTypesByPracticeAreaIds";
import { IController } from "../Interface/IController";

export class FindCaseTypesByPracticeAreasController implements IController {
    constructor(
        private _findCaseTypes: IFindCaseTypesByPracticeAreas,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let practiceIds: string[] = [];
        if (httpRequest.query && typeof httpRequest.query === "object" && "pids" in httpRequest.query) {
            if (Array.isArray(httpRequest.query.pids)) {
                practiceIds = httpRequest.query.pids;
            } else if (typeof httpRequest.query.pids === "string") {
                practiceIds = [httpRequest.query.pids];
            }
        }
        if (!practiceIds) {
            return this._errors.error_400("no practice areas found");
        }
        try {
            const res = await this._findCaseTypes.execute(practiceIds);
            return this._success.success_200(res);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
