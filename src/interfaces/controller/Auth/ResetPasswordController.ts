import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IResetPasswordUsecase } from "@src/application/usecases/Auth/IResetPasswordusecase";

export class ResetPasswordController implements IController {
  constructor(
    private _resetPasswordUsecase: IResetPasswordUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let token = "";
    let password = "";
    console.log(httpRequest.body);
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("token" in httpRequest.body) {
        token = String(httpRequest.body.token);
      }
      if ("password" in httpRequest.body) {
        password = String(httpRequest.body.password);
      }
    }
    if (!token || !password) {
      return this._errors.error_400("Invalid credentials");
    }
    try {
      await this._resetPasswordUsecase.execute({ token, password });
      return this._success.success_200({
        message: "Password Reset Successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
