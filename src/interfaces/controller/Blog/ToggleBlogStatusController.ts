import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IToggleBlogPublishUsecase } from "@src/application/usecases/Blog/IToggleBlogPublishUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class ToggleBlogStatusController implements IController {
  constructor(
    private _toggleBlogStatus: IToggleBlogPublishUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let id = "";
    let toggle;
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      id = String(httpRequest.params.id);
    }
    if (!id) return this._errors.error_400("blog id not found");

    try {
      const result = await this._toggleBlogStatus.execute(id);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
