import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchSessionDocumentsUseCase } from "@src/application/usecases/Lawyer/IFetchSessionDocumentsUseCase";

export class FetchSessionsDocumentsController implements IController {
  constructor(
    private fetchSessionDocuments: IFetchSessionDocumentsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let session_id: string = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      session_id = String(httpRequest.params.id);
    }
    if (!session_id) {
      return this.httpErrors.error_400("session id is required");
    }
    try {
      const result = await this.fetchSessionDocuments.execute(session_id);
      return this.httpSuccess.success_200({
        success: true,
        message: "document fetched successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_500(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
