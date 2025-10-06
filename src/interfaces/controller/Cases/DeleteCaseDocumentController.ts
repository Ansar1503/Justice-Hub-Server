import { IDeleteCaseDocument } from "@src/application/usecases/CaseDocuments/IDeleteCaseDocument";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { WLogger } from "@shared/utils/Winston/WinstonLoggerConfig";

export class DeleteCaseDocumentsController implements IController {
  constructor(
    private _deleteCaseDocument: IDeleteCaseDocument,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let documentId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      documentId = String(httpRequest.params.id);
    }
    if (!documentId) {
      WLogger.warn("document Id not found", {
        page: "Delete Case docs controller",
      });
      return this._errors.error_400("document id not found");
    }
    try {
      const result = await this._deleteCaseDocument.execute({
        documentId: documentId,
        userId: userId,
      });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
