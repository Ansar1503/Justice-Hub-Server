import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUpdatePasswordUseCase } from "@src/application/usecases/Client/IUpdatePasswordUseCase";
import { IController } from "../../Interface/IController";

export class UpdatePasswordController implements IController {
    constructor(
        private updatePassword: IUpdatePasswordUseCase,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const { password, currentPassword } = req.body;
        if (!password) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, {
                message: "password not found",
            });
        }
        if (!currentPassword) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, {
                message: "current password not found",
            });
        }
        try {
            const user_id = req.user?.id;
            const payload = { currentPassword, password, user_id };
            const response = await this.updatePassword.execute(payload);
            if (!response) {
                const err = this.httpErrors.error_400();
                return new HttpResponse(err.statusCode, {
                    message: "Error Updating Password",
                });
            }
            const success = this.httpSuccess.success_200();
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
