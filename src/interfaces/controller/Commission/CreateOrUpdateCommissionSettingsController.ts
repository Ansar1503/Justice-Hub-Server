import { ICreateOrUpdateCommissionSettingsUsecase } from "@src/application/usecases/Commission/ICreateOrUpdateCommissionSettingsUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { CreateCommissionSettingsInputSchema } from "@interfaces/middelwares/validator/zod/Commission/CreateCommissionInputSchema";

export class CreateOrUpdateCommissionSettingsController implements IController {
  constructor(
    private _createOrUpdateCommissionSettings: ICreateOrUpdateCommissionSettingsUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = await CreateCommissionSettingsInputSchema.safeParse(
      httpRequest.body
    );
    if (!parsed.success) {
      const err = parsed.error.errors[0];
      return this._errors.error_400(err.message);
    }
    try {
      const result = await this._createOrUpdateCommissionSettings.execute(
        parsed.data
      );
      return this._success.success_201(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
