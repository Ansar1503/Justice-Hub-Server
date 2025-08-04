import { Ilawyerusecase } from "@src/application/usecases/I_usecases/I_lawyer.usecase";
import { IController } from "../../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";

export class UpdateLawyerSlotSettingsController implements IController {
  constructor(
    private lawyerUseCase: Ilawyerusecase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id: string = "";
    let slotDuration: number = 0;
    let maxDaysInAdvance: number = 0;
    let autoConfirm: boolean = false;
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

    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("slotDuration" in httpRequest.body) {
        if (typeof httpRequest.body.slotDuration === "number") {
          slotDuration = httpRequest.body.slotDuration;
        } else if (typeof httpRequest.body.slotDuration === "string") {
          slotDuration = parseInt(httpRequest.body.slotDuration);
        }
      }
      if ("maxDaysInAdvance" in httpRequest.body) {
        if (typeof httpRequest.body.maxDaysInAdvance === "number") {
          maxDaysInAdvance = httpRequest.body.maxDaysInAdvance;
        }
        if (typeof httpRequest.body.maxDaysInAdvance === "string") {
          maxDaysInAdvance = parseInt(httpRequest.body.maxDaysInAdvance);
        }
      }
      if ("autoConfirm" in httpRequest.body) {
        if (typeof httpRequest.body.autoConfirm === "boolean") {
          autoConfirm = httpRequest.body.autoConfirm;
        }
        if (typeof httpRequest.body.autoConfirm === "string") {
          autoConfirm = httpRequest.body.autoConfirm === "true" ? true : false;
        }
      }
    }

    if (
      !slotDuration ||
      !maxDaysInAdvance ||
      autoConfirm === undefined ||
      autoConfirm === null
    ) {
      return this.httpErrors.error_400("Provide required fields");
    }
    try {
      const slotSettings = await this.lawyerUseCase.updateSlotSettings({
        lawyer_id: user_id,
        autoConfirm,
        maxDaysInAdvance,
        slotDuration,
      });
      return this.httpSuccess.success_200(slotSettings);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
