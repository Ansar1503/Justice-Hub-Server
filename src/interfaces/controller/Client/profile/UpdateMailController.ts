import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IChangeMailUseCase } from "@src/application/usecases/Client/IChangeMailUseCase";
import { IController } from "../../Interface/IController";

export class UpdateEmailController implements IController {
    constructor(
        private _changeEmail: IChangeMailUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const { email } = req?.body;
        if (!email) {
            const err = this._httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        const user_id = req.user?.id;
        try {
            const responserUser = await this._changeEmail.execute({ email, user_id });
            if (!responserUser) {
                const err = this._httpErrors.error_400();
                return new HttpResponse(err.statusCode, {
                    message: "error changing mail",
                });
            }
            const success = this._httpSuccess.success_200(responserUser);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
