import { IUpdatePracticeAreaUsecase } from "@src/application/usecases/PracitceAreas/IUpdatePracticeAreaUsecase";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class UpdatePracticeAreaController implements IController {
  constructor(
    private _updatePracticeAreasUsecase: IUpdatePracticeAreaUsecase,
    private _httpSuccess: IHttpSuccess,
    private _httpErrors: IHttpErrors
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let specId = "";
    let id = "";
    let name = "";
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("id" in httpRequest.body) {
        id = String(httpRequest.body.id);
      }
      if ("specId" in httpRequest.body) {
        specId = String(httpRequest.body.specId);
      }
      if ("name" in httpRequest.body) {
        name = String(httpRequest.body.name);
      }
    }
    if (!id) {
      return this._httpErrors.error_400("id is required");
    }
    if (!specId) {
      return this._httpErrors.error_400("specification id is required");
    }
    if (!name) {
      return this._httpErrors.error_400("name is required");
    }
    try {
      const result = await this._updatePracticeAreasUsecase.execute({
        id,
        name,
        specId,
      });
      return this._httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._httpErrors.error_400(error.message);
      }
      return this._httpErrors.error_500();
    }
  }
}
