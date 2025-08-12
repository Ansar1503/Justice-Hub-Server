import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IRemoveSessionDocumentsUseCase } from "@src/application/usecases/Client/IRemoveSessionDocumentsUseCase";

export class RemoveSessionDocumentController implements IController {
  constructor(
    private removeSessionDocument: IRemoveSessionDocumentsUseCase,
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
      const result = await this.removeSessionDocument.execute({
        documentId: documentId,
        sessionId: String(session),
      });
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
