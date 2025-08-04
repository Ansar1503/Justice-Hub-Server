import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

export class CancelSessionController implements IController {
  constructor(private clientUsecase: I_clientUsecase) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { id } = (httpRequest.body as { id?: string }) || {};

    if (!id) {
      throw new ValidationError("Session ID is required");
    }

    const result = await this.clientUsecase.cancelSession({ session_id: id });

    return new HttpResponse(200, {
      success: true,
      message: "success",
      data: result,
    });
  }
}
