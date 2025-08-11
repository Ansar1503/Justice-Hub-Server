import { IController } from "../../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchSlotSettingsUseCase } from "@src/application/usecases/Lawyer/IFetchSlotSettingsUseCase";

export class FetchSlotSettingsController implements IController {
  constructor(
    private slotSettings: IFetchSlotSettingsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id: string = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      user_id = String(httpRequest.params.id);
    }
    if (!user_id) {
      return this.httpErrors.error_400("User_id Not found");
    }
    try {
      const response = await this.slotSettings.execute(user_id);
      return this.httpSuccess.success_200({
        success: true,
        message: "data fetched",
        data: response || {},
      });
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_500(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
