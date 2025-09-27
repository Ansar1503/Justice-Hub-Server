import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IVerifyMailUseCase } from "@src/application/usecases/Client/IVerifyMailUseCase";
import { IController } from "../../Interface/IController";

export class SendVerificationMailController implements IController {
    constructor(
        private verifyMail: IVerifyMailUseCase,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const { email } = req.body;
        if (!email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        const user_id = req.user?.id;
        try {
            await this.verifyMail.execute({ email, user_id });
            const success = this.httpSuccess.success_200();
            return new HttpResponse(success.statusCode, success.body);
        } catch (error: any) {
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, {
                message: "Error verifying email",
            });
        }
    }
}
