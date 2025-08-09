import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchOverrideSlotsUseCase } from "@src/application/usecases/Lawyer/IFetchOverrideSlotsUseCase";

export class FetchOverrideSlots implements IController {
  constructor(
    private fetchOverrideSlots: IFetchOverrideSlotsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id: string = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      user_id = String(httpRequest.user.id);
    }
    if (!user_id) {
      return this.httpErrors.error_400("User_id Not found");
    }
    try {
      const response = await this.fetchOverrideSlots.execute(user_id);
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_500(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
