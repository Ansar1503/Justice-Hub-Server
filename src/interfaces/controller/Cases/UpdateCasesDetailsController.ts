import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IUpdateCasesDetailsUsecase } from "@src/application/usecases/Case/Interfaces/IUpdateCasesDetailsUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { UpdateCasesDetailsFormSchema } from "@interfaces/middelwares/validator/zod/Cases/UpdateCasesDetailsFormSchema";

export class UpdateCaseDetailsController implements IController {
    constructor(private _updateCaseDetailsUsecase: IUpdateCasesDetailsUsecase, private _errors: IHttpErrors, private _success: IHttpSuccess) { }
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let caseId = ""
        if (httpRequest?.params && typeof httpRequest.params === "object" && 'id' in httpRequest.params) {
            caseId = String(httpRequest.params.id)
        }
        if (!caseId.trim()) {
            return this._errors.error_400("case Id is required")
        }
        const parsed = await UpdateCasesDetailsFormSchema.safeParse(httpRequest.body)
        if (!parsed.success) {
            const er = parsed.error.issues[0]
            return this._errors.error_400(er.message)
        }
        try {
            const result = await this._updateCaseDetailsUsecase.execute({ ...parsed.data, caseId })
            return this._success.success_200(result)
        } catch (error) {
            console.log("errors", error)
            if (error instanceof Error) {
                return this._errors.error_500(error.message)
            }
            return this._errors.error_500()
        }
    }
}