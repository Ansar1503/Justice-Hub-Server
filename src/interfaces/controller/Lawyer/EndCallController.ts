import { IStartCallUsecase } from "@src/application/usecases/Lawyer/IStartCallUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IEndCallUsecase } from "@src/application/usecases/Lawyer/IEndCallUsecase";

export class EndCallController implements IController {
  constructor(
    private _endCall: IEndCallUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { sessionId, roomId } = httpRequest.body as Record<string, any>;
    if (!sessionId || !roomId)
      return this._errors.error_400("Invalid Credentials");
    const { id: userId } = httpRequest.user as Record<string, any>;
    try {
      await this._endCall.execute({ sessionId, roomId, userId });
      return this._success.success_200({
        success: true,
        message: "Call Ended Successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500("Something went wrong");
    }
  }
}
