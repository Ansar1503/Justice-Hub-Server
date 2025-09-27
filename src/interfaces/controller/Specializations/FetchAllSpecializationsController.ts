import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { FetchAllSpecializationsQueryValidatorSchema } from "@interfaces/middelwares/validator/zod/specialization/FetchAllSpecializationsQueryValidator";
import { IFetchAllSpecializationsUsecase } from "@src/application/usecases/Specializations/IFetchAllSpecializationsUsecase";

export class FetchAllSpecializationsController implements IController {
    constructor(
    private FetchAllSpecializations: IFetchAllSpecializationsUsecase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const parsed = FetchAllSpecializationsQueryValidatorSchema.safeParse(
            httpRequest.query
        );
        if (!parsed.success) {
            const error = parsed.error.errors[0];
            return this.httpErrors.error_400(error.message);
        }
        try {
            const result = await this.FetchAllSpecializations.execute(parsed.data);
            return this.httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
