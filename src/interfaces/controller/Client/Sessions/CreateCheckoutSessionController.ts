import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpRequest as BaseIHttpRequest } from "@interfaces/helpers/IHttpRequest";

interface IHttpRequest extends BaseIHttpRequest {
  user?: {
    id?: string;
    [key: string]: any;
  };
}
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { ERRORS } from "@infrastructure/constant/errors";
import { ICreateCheckoutSessionUseCase } from "@src/application/usecases/Client/ICreateCheckoutSessionUseCase";

export class CreateCheckoutSessionController implements IController {
  constructor(
    private readonly createCheckoutSession: ICreateCheckoutSessionUseCase,
    private readonly httpErrors: IHttpErrors = new HttpErrors(),
    private readonly httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const user_id = httpRequest.user?.id;
      const { lawyer_id, date, timeSlot, duration, reason } =
        (httpRequest.body as {
          lawyer_id?: string;
          date?: string;
          timeSlot?: string;
          duration?: number;
          reason?: string;
        }) || {};

      if (
        !lawyer_id ||
        !date ||
        !timeSlot ||
        !user_id ||
        !duration ||
        !reason
      ) {
        console.log("invalid creds", {
          lawyer_id,
          date,
          timeSlot,
          user_id,
          duration,
          reason,
        });
        return this.httpErrors.error_400("Invalid Credentials");
      }

      const dateObj = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      );

      const response = await this.createCheckoutSession.execute({
        client_id: user_id,
        date: dateObj,
        duration,
        lawyer_id,
        reason,
        timeSlot,
      });

      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
