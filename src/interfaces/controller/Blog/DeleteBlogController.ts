import { IDeleteBlogUsecase } from "@src/application/usecases/Blog/IDeleteBlogUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class DeleteBlogController implements IController {
  constructor(
    private _deleteBlog: IDeleteBlogUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let blogId = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      blogId = String(httpRequest.params.id);
    }
    if (!blogId) return this._errors.error_400("blog id not found");
    try {
      const result = await this._deleteBlog.execute(blogId);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
