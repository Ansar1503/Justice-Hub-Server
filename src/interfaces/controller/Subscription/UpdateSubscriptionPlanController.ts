import { IUpdateSubscriptionPlanUsecase } from "@src/application/usecases/Subscription/IUpdateSubscriptionPlanUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { AddSubscriptionPlanZodInputSchema } from "@interfaces/middelwares/validator/zod/Subscription/AddSubscriptionPlanZodValidation";

export class UpdateSubscriptionPlanController implements IController {
  constructor(
    private _updateSubscriptionPlan: IUpdateSubscriptionPlanUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = await AddSubscriptionPlanZodInputSchema.safeParse(
      httpRequest.body
    );
    if (!parsed.success) {
      const error = parsed.error.errors[0];
      return this._errors.error_400(error.message);
    }
    let id = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      id = String(httpRequest.params.id);
    }
    if (!id.trim()) {
      return this._errors.error_400("subscription plan Id not found");
    }
    try {
      const result = await this._updateSubscriptionPlan.execute({
        ...parsed.data,
        id: id,
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
