import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class RefreshToken implements IController {
  constructor(
    private userUseCase: any,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const token = (httpRequest as Record<string, any>)?.cookies?.refresh;
    if (!token) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    try {
      const accesstoken = this.userUseCase.userReAuth(token);
      if (!accesstoken) {
        const err = this.httpErrors.error_400();
        return new HttpResponse(err.statusCode, err.body);
      }
      const success = this.httpSuccess.success_200(accesstoken);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
