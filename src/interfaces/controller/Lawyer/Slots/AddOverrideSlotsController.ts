import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { zodOverrideSlotsSchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IAddOverrideSlotsUseCase } from "@src/application/usecases/Lawyer/IAddOverrideSlotsUseCase";

export class AddOverrideSlotsController implements IController {
    constructor(
    private addOverrideUsecase: IAddOverrideSlotsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id: string = "";
        if (
            httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
        ) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        const payload = zodOverrideSlotsSchema.safeParse(httpRequest.body);
        if (!payload.success) {
            payload.error.errors.forEach((err) => {
                return this.httpErrors.error_400(err.message);
            });
            return this.httpErrors.error_400("invalid Credentials");
        }
        if (payload.data && Object.keys(payload.data).length === 0) {
            return this.httpErrors.error_400("invalid Credentials");
        }
        try {
            const response = await this.addOverrideUsecase.execute({
                overrideDates: payload.data,
                lawyer_id: user_id,
            });
            const body = {
                success: true,
                message: "override slot added",
                data: response,
            };
            return this.httpSuccess.success_200(body);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
