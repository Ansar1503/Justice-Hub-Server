import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AppError } from "@interfaces/middelwares/Error/CustomError";
import { IEndSessionUseCase } from "@src/application/usecases/Lawyer/IEndSessionUseCase";

export class EndSessionController implements IController {
  constructor(
    private endSession: IEndSessionUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let sessionId: string = "";
    if (
      httpRequest.body &&
      typeof httpRequest.body === "object" &&
      "sessionId" in httpRequest.body
    ) {
      sessionId = String(httpRequest.body.sessionId);
    }
    if (!sessionId) {
      return this.httpErrors.error_400("session id is required");
    }
    try {
      const result = await this.endSession.execute({ sessionId });
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof AppError) {
        return new HttpResponse(error.statusCode, error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
