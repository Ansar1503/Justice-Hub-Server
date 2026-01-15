import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { FetchCaseByCaseTypesSchema } from "@interfaces/middelwares/validator/zod/Cases/FetchingCaseByCaseTypesSchema";
import { WLogger } from "@shared/utils/Winston/WinstonLoggerConfig";
import { IFetchCaseByCaseTypeIdsUsecase } from "@src/application/usecases/Case/Interfaces/IFetchCaseByCaseidsUsecase";

export class FetchCaseByCaseTypesIdsController implements IController {
  constructor(
    private _fetchCasesByCaseType: IFetchCaseByCaseTypeIdsUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let lawyerId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    const parsed = await FetchCaseByCaseTypesSchema.safeParse(
      httpRequest.query
    );

    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      lawyerId = String(httpRequest.params.id);
    }
    if (!lawyerId) {
      return this._errors.error_400("lawyer Id not found");
    }
    if (!userId) {
      WLogger.warn("user id not found", {
        page: "FetchCaseByCaseTypeIdsController",
      });
      return this._errors.error_400("user Id not found");
    }
    if (!parsed.success) {
      const er = parsed.error.errors[0];
      WLogger.warn(er);
      return this._errors.error_400(er.message);
    }
    if (parsed.data.caseTypeIds.length === 0) {
      WLogger.warn("no casetypes found", {
        page: "FetchCaseByCaseTypeIdsController",
      });
      return this._errors.error_400("no casetypes found");
    }
    try {
      const result = await this._fetchCasesByCaseType.execute({
        caseTypeIds: parsed.data.caseTypeIds,
        userId: userId,
        lawyerId: lawyerId,
      });
      return this._success.success_200(result);
    } catch (error) {
      WLogger.warn(error);
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
