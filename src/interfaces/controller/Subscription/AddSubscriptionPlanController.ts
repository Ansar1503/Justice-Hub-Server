import { IAddSubscriptionPlanUsecase } from "@src/application/usecases/Subscription/IAddSubscriptionPlanUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { AddSubscriptionPlanZodInputSchema } from "@interfaces/middelwares/validator/zod/Subscription/AddSubscriptionPlanZodValidation";

export class AddSubscriptionPlanController implements IController {
  constructor(
    private _addSubscriptionUsecase: IAddSubscriptionPlanUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = await AddSubscriptionPlanZodInputSchema.safeParse(
      httpRequest.body
    );
    if (!parsed.success) {
      const er = parsed.error.errors[0];
      return this._errors.error_400(er.message);
    }
    try {
      const result = await this._addSubscriptionUsecase.execute(parsed.data);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
