import { ICreateBlogUsecase } from "@src/application/usecases/Blog/ICreateBlogUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { CreateBlogSchema } from "@interfaces/middelwares/validator/zod/Blog/BlogValidation";

export class CreateBlogController implements IController {
  constructor(
    private _CreateBlogUsecase: ICreateBlogUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    const parsed = await CreateBlogSchema.safeParse(httpRequest.body);
    if (!userId) {
      return this._errors.error_400("user Id not found");
    }
    if (!parsed.success) {
      const err = parsed.error.errors[0];
      return this._errors.error_400(err.message);
    }
    try {
      const result = await this._CreateBlogUsecase.execute({
        ...parsed.data,
        lawyerId: userId,
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
