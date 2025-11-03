import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { ILikeOrDislikeBlogUsecase } from "@src/application/usecases/Blog/ILikeblogusecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class LikeOrDislikeBlogController implements IController {
  constructor(
    private _likeOrDislike: ILikeOrDislikeBlogUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let blogId = "";
    let userId = "";
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
      blogId = String(httpRequest.params.id);
    }
    if (!userId) return this._errors.error_400("user id not found");
    if (!blogId) return this._errors.error_400("blog id not found");
    try {
      const result = await this._likeOrDislike.execute({ blogId, userId });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
