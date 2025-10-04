import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { FetchCasesDocumentsByCaseInputZodSchema } from "@interfaces/middelwares/validator/zod/Cases/CaseDocumentsQuerySchema";
import { IFindCaseDocumentsByCaseUsecase } from "@src/application/usecases/CaseDocuments/IFindCaseDocumentsByCase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { WLogger } from "@shared/utils/Winston/WinstonLoggerConfig";

export class FindCaseDocumentsByCaseController implements IController {
  constructor(
    private _findCaseDocuments: IFindCaseDocumentsByCaseUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let caseId = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      caseId = String(httpRequest.params.id);
    }
    const parsed = FetchCasesDocumentsByCaseInputZodSchema.safeParse(
      httpRequest.query
    );
    if (!parsed.success) {
      const er = parsed.error.errors[0];
      WLogger.error(er.message, er);
      return this._errors.error_400(er.message);
    }
    if (!caseId) {
      WLogger.error("Case Id not found", {
        page: "FindCaseDocumentsByCaseController",
      });
      throw new Error("case id not found");
    }
    try {
      const result = await this._findCaseDocuments.execute({
        ...parsed.data,
        caseId,
      });
      WLogger.info("Results found", result);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
