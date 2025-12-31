import { IFetchPaymentsUsecase } from "@src/application/usecases/Client/IFetchPaymentsUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { fetchPaymentsQueryValidation } from "@interfaces/middelwares/validator/zod/FetchPaymentsQueryValidation";

export class FetchPaymentsController implements IController {
  constructor(
    private _fetchPaymentsUsecase: IFetchPaymentsUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = await fetchPaymentsQueryValidation.safeParse(
      httpRequest.query
    );
    if (!parsed.success) {
      const err = parsed.error.issues[0].message;
      return this._errors.error_400(err);
    }
    try {
      const data = await this._fetchPaymentsUsecase.execute(parsed.data);
      return this._success.success_200(data);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
