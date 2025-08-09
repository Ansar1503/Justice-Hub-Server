import "dotenv/config";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IVerifyEmailUseCase } from "@src/application/usecases/Auth/IVerifyEmailUseCase";

export class VerifyEmailController implements IController {
  constructor(
    private verifyMaiUseCase: IVerifyEmailUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { token, email } = httpRequest.query as Record<string, any>;
    if (!token || !email) {
      const errr = this.httpErrors.error_400();
      return new HttpResponse(errr.statusCode, {
        redirectUrl: `${process.env.FRONTEND_URL}/email-validation-error?error=invalid&email=${email}`,
        message: "Invalid Credentials",
      });
    }
    try {
      await this.verifyMaiUseCase.execute({
        email,
        token,
      });
      const success = this.httpSuccess.success_200({
        redirectUrl: `${process.env.FRONTEND_URL}/email-verified`,
      });
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      console.log("verify email error ", error);
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
