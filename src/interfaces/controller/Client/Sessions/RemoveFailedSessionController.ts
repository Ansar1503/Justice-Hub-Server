import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IController } from "@interfaces/controller/Interface/IController";
import { IGetSessionMetadataUseCase } from "@src/application/usecases/Client/IGetSessionMetadataUseCase";

export class RemoveFailedSessionController implements IController {
  constructor(private getSessionMetadata: IGetSessionMetadataUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const session_id = (httpRequest.params as { id?: string })?.id;

    if (!session_id) {
      return new HttpResponse(400, {
        success: false,
        message: "Session ID not found",
      });
    }

    try {
      const response = await this.getSessionMetadata.execute(session_id);
      return new HttpResponse(200, {
        success: true,
        message: "Success",
        data: response,
      });
    } catch (error: any) {
      return new HttpResponse(error.code || 500, {
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
