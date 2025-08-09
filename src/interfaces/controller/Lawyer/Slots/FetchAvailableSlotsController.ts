import { IController } from "../../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchAvailableSlotsUseCase } from "@src/application/usecases/Lawyer/IFetchAvailableSlotsUseCase";

export class FetchAvailableSlotsController implements IController {
  constructor(
    private availableSlots: IFetchAvailableSlotsUseCase,
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
      const response = await this.availableSlots.execute(user_id);
      return this.httpSuccess.success_200({
        success: true,
        message: "fetched data",
        data: response,
      });
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_500(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
