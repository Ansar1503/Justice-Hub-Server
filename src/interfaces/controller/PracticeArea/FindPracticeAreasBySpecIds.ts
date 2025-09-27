import { IFindPracticeareasByspecIdsUsecase } from "@src/application/usecases/PracitceAreas/IFindPracticeAreasBySpecIdsUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class FindPracticeAreasBySpecIds implements IController {
    constructor(
        private _FindPracticeAreaUsecase: IFindPracticeareasByspecIdsUsecase,
        private _Errors: IHttpErrors,
        private _Success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let specIds: string[] = [];
        if (httpRequest.query && typeof httpRequest.query === "object" && "specIds" in httpRequest.query) {
            if (Array.isArray(httpRequest.query.specIds)) {
                specIds = httpRequest.query.specIds;
            } else if (typeof httpRequest.query.specIds === "string") {
                specIds = [httpRequest.query.specIds];
            }
        }
        if (!specIds) {
            return this._Errors.error_400("no specids found");
        }
        try {
            const result = await this._FindPracticeAreaUsecase.execute({ specIds });
            return this._Success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._Errors.error_400(error.message);
            }
            return this._Errors.error_500();
        }
    }
}
