import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpRequest } from "@interfaces/helpers/IHttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { ERRORS } from "@infrastructure/constant/errors";
import { IFetchLawyerSlotsUseCase } from "@src/application/usecases/Client/IFetchLawyerSlotsUseCase";

export class GetLawyerSlotDetailsController implements IController {
  constructor(
    private readonly fetchLawyerSlots: IFetchLawyerSlotsUseCase,
    private readonly httpErrors: IHttpErrors = new HttpErrors(),
    private readonly httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const lawyer_id = (httpRequest.params as { id: string })?.id || "";
      const date = (httpRequest.query as { date: string })?.date;
      const client_id = (
        httpRequest as IHttpRequest & { user?: { id?: string } }
      ).user?.id;

      if (!lawyer_id.trim() || !date || !client_id) {
        return this.httpErrors.error_400("Invalid Credentials");
      }
      const result = await this.fetchLawyerSlots.execute({
        lawyer_id,
        date: date,
        client_id,
      });

      return this.httpSuccess.success_200({
        success: true,
        message: "Lawyer slots fetched successfully",
        data: result,
      });
    } catch (error: any) {
      switch (error.message) {
        case ERRORS.USER_NOT_FOUND:
          return this.httpErrors.error_404("User not found");
        case ERRORS.USER_BLOCKED:
          return this.httpErrors.error_403("User is blocked");
        case ERRORS.LAWYER_NOT_VERIFIED:
          return this.httpErrors.error_400("Lawyer is not verified");
        default:
          return this.httpErrors.error_500(
            error.message || "Internal Server Error"
          );
      }
    }
  }
}
