import { IFetchCasesByQueryUsecase } from "@src/application/usecases/Case/Interfaces/IFetchCasesByQuery";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { FindCasesQueryInputZodSchema } from "@interfaces/middelwares/validator/zod/Cases/FindCasesQuerySchema";
import { IController } from "../Interface/IController";

export class FetchAllCasesByQueryController implements IController {
    constructor(
        private _fetchCasesUsecase: IFetchCasesByQueryUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        const parsed = FindCasesQueryInputZodSchema.safeParse(httpRequest.query);
        if (!userId) {
            return this._errors.error_400("userId not found");
        }
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._fetchCasesUsecase.execute({
                ...parsed.data,
                userId: userId,
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
