import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { ILoginUserUseCase } from "@src/application/usecases/Auth/ILoginUserUseCase";
import { IController } from "../Interface/IController";

export class LoginController implements IController {
  constructor(
    private _loginUseCase: ILoginUserUseCase,
    private _httpErrors: IHttpErrors = new HttpErrors(),
    private _httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { email, password } = httpRequest.body as Record<string, any>;
    if (!email || !password) {
      const err = this._httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    try {
      const responsedata = await this._loginUseCase.execute({
        email: email.toLowerCase(),
        password,
      });
      const success = this._httpSuccess.success_200(responsedata);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      if (error instanceof Error) {
        return this._httpErrors.error_400(error.message);
      }
      const err = this._httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
