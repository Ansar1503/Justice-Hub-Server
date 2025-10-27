import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IUpdateBlogUsecase } from "@src/application/usecases/Blog/IUpdateBlogUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { CreateBlogSchema } from "@interfaces/middelwares/validator/zod/Blog/BlogValidation";

export class UpdateBlogController implements IController {
  constructor(
    private _updateBlog: IUpdateBlogUsecase,
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
      const parsed = await CreateBlogSchema.safeParse(httpRequest.body);
      if (!parsed.success) {
        const err = parsed.error.errors[0];
        return this._errors.error_400(err.message);
      }
      const success = await this._updateBlog.execute({
        ...parsed.data,
        blogId,
      });
      return this._success.success_200(success);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
