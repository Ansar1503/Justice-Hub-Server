import { IFechAllCasetypeUsecase } from "@src/application/usecases/CaseType/IFetchAllCasetypeUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { CasetypeQueryValidationSchema } from "@interfaces/middelwares/validator/zod/Casetype/CasetypeQueryValidation";
import { IController } from "../Interface/IController";

export class FetchAllCasetypeController implements IController {
    constructor(
        private _usecase: IFechAllCasetypeUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const parsed = CasetypeQueryValidationSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._usecase.execute({
                ...parsed.data,
                practiceAreaId: parsed.data.pid,
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
