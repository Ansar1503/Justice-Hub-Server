import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchBlogsByLawyerUsecase } from "@src/application/usecases/Blog/IFetchBlogsByLawyerUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { FetchBlogsByLawyerQueryZodSchema } from "@interfaces/middelwares/validator/zod/Blog/FetchBlogsByLawyer";

export class FetchBlogsByLawyerController implements IController {
  constructor(
    private _FetchBlogsByLawyer: IFetchBlogsByLawyerUsecase,
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
    if (!userId) return this._errors.error_400("user  id not found");
    const parsed = FetchBlogsByLawyerQueryZodSchema.safeParse(
      httpRequest.query
    );
    if (!parsed.success) {
      const err = parsed.error.errors[0];
      return this._errors.error_400(err.message);
    }
    try {
      const result = await this._FetchBlogsByLawyer.execute({
        ...parsed.data,
        lawyerId: userId,
      });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_500(error.message);
      }
      return this._errors.error_500("Unknown error occurred");
    }
  }
}
