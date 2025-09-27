import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IVerifyEmailByOtp } from "@src/application/usecases/Auth/IVerifyEmailByOtp";
import { IController } from "../Interface/IController";

export class VerifyEmailOtpController implements IController {
    constructor(
        private verifyEmailByOtpUseCase: IVerifyEmailByOtp,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const { otpValue: otp, email } = httpRequest.body as Record<string, any>;
        if (!otp || !email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        try {
            await this.verifyEmailByOtpUseCase.execute({ email, otp });
            const success = this.httpSuccess.success_200();
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            console.log("verify email otp controller", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
