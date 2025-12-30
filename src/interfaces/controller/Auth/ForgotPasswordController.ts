import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IForgotPasswordUsecase } from "@src/application/usecases/Auth/IForgotPasswordUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class ForgotPasswordController implements IController {
  constructor(
    private _forgotPasswordUsecase: IForgotPasswordUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let email = "";
    if (
      httpRequest.body &&
      typeof httpRequest.body === "object" &&
      "email" in httpRequest.body
    ) {
      email = String(httpRequest.body.email);
    }
    if (!email.trim()) {
      return this._errors.error_400("Email Required");
    }
    try {
      const result = await this._forgotPasswordUsecase.execute({ email });
      return this._success.success_200({ message: "Verification Mail Send!" });
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
