import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpRequest } from "@interfaces/helpers/IHttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";

export class GetLawyerSlotSettingsController implements IController {
  constructor(
    private readonly clientUseCase: I_clientUsecase,
    private readonly httpErrors: IHttpErrors = new HttpErrors(),
    private readonly httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id: lawyer_id } = httpRequest.params as { id: string };

      if (!lawyer_id || lawyer_id.trim() === "") {
        return this.httpErrors.error_400("Invalid credentials");
      }

      const slotSettings = await this.clientUseCase.fetchLawyerSlotSettings(
        lawyer_id
      );

      return this.httpSuccess.success_200({
        success: true,
        message: "Slot settings fetched successfully",
        data: slotSettings,
      });
    } catch (error) {
      console.error("GetLawyerSlotSettingsController Error:", error);
      return this.httpErrors.error_500("Something went wrong");
    }
  }
}
