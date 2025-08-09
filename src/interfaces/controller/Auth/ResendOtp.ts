import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IResendOtpUseCase } from "@src/application/usecases/Auth/IResendOtpUseCase";

export class ResendOtpController implements IController {
  constructor(
    private resendOtpUseCase: IResendOtpUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { email } = httpRequest.body as Record<string, any>;
    if (!email) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    try {
      await this.resendOtpUseCase.execute(email?.toLowerCase());
      const success = this.httpSuccess.success_200();
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
