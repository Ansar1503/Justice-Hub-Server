import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUserReAuth } from "@src/application/usecases/Auth/IUserReAuthUseCase";

export class RefreshToken implements IController {
  constructor(
    private userReAuth: IUserReAuth,
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
      const accesstoken = await this.userReAuth.execute(token);
      if (!accesstoken) {
        const err = this.httpErrors.error_400();
        return new HttpResponse(err.statusCode, err.body);
      }
      const success = this.httpSuccess.success_200(accesstoken);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      console.log("error in refresh", error);
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
