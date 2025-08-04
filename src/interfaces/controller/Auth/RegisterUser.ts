import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IController } from "../Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class RegisterUser implements IController {
  constructor(
    private userUseCase: any,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    try {
      const user = await this.userUseCase.createUser(httpRequest.body);
      if (!user) {
        const err = this.httpErrors.error_500();
        return new HttpResponse(err.statusCode, {
          message: "Error Registering User",
        });
      }
      const success = this.httpSuccess.success_201(user);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, {
        message: "Error Registering User",
      });
    }
  }
}
