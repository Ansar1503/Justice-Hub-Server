import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class UpdateEmailController implements IController {
  constructor(
    private clientUseCase: I_clientUsecase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const { email } = req?.body;
    if (!email) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    const user_id = req.user?.id;
    // console.log("email:", email);
    try {
      const responserUser = await this.clientUseCase.changeEmail(
        email,
        user_id
      );
      if (!responserUser) {
        const err = this.httpErrors.error_400();
        return new HttpResponse(err.statusCode, {
          message: "error changing mail",
        });
      }
      const success = this.httpSuccess.success_200(responserUser);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      console.log("erro:", error);
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, {
        message: "error changing mail",
      });
    }
  }
}
