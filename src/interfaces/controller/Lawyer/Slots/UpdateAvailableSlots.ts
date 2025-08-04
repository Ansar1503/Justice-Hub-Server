import { Ilawyerusecase } from "@src/application/usecases/I_usecases/I_lawyer.usecase";
import { IController } from "../../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { Availability } from "@src/application/dtos/AvailableSlotsDto";

export class UpdateAvailableSlotsController implements IController {
  constructor(
    private lawyerUseCase: Ilawyerusecase,
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
    if (
      typeof httpRequest.body === "object" &&
      httpRequest.body !== null &&
      Object.keys(httpRequest.body).length === 0
    ) {
      return this.httpErrors.error_400("Invalid Credentials");
    }

    try {
      const result = await this.lawyerUseCase.updateAvailableSlot(
        httpRequest.body as Availability,
        user_id
      );
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_500(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
