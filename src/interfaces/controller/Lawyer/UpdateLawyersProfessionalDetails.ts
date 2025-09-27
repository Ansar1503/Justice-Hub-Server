import { IUpdateProfessionalDetailsUsecase } from "@src/application/usecases/Lawyer/IUpdateProfessionalDetails";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { ProfessionalDetailsSchema } from "@interfaces/middelwares/validator/zod/lawyer/LawyerProfessionalDetailsUpdateSchema";
import { IController } from "../Interface/IController";

export class UpdateLawyersProfessionalDetails implements IController {
    constructor(
        private _usecase: IUpdateProfessionalDetailsUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        const parsed = ProfessionalDetailsSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._errors.error_400(err.message);
        }
        if (!userId) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._usecase.execute({ ...parsed.data, userId });
            return this._success.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
