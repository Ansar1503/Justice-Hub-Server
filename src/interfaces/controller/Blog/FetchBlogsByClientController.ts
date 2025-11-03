import { IFetchBlogsByClientUsecase } from "@src/application/usecases/Blog/IFetchBlogsByClientUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { FetchBlogsByClientSchema } from "@interfaces/middelwares/validator/zod/Blog/BlogValidation";

export class FetchBlogsByClientController implements IController {
  constructor(
    private _fetchBlogsByClient: IFetchBlogsByClientUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = await FetchBlogsByClientSchema.safeParse(httpRequest.query);
    if (!parsed.success) {
      const error = parsed.error.errors[0];
      return this._errors.error_400(error.message);
    }
    try {
      const response = await this._fetchBlogsByClient.execute(parsed.data);
      return this._success.success_200(response);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
