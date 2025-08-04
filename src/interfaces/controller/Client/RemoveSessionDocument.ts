import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class RemoveSessionDocumentController implements IController {
  constructor(
    private clientUseCase: I_clientUsecase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const { id: documentId } = req.params;
    const { session } = req.query;
    if (!documentId) {
      return new HttpResponse(400, { message: "document id not found" });
    }
    if (!session) {
      return new HttpResponse(400, { message: "session id not found" });
    }
    try {
      const result = await this.clientUseCase.removeSessionDocument({
        documentId: documentId,
        sessionId: String(session),
      });
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
