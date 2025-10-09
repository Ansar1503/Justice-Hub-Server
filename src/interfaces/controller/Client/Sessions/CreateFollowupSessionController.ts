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
import { ICreateFollowupCheckoutUsecase } from "@src/application/usecases/Client/ICreateFollowupCheckouUsecase";

export class CreateFollowupCheckoutSessionController implements IController {
  constructor(
    private readonly _createFollowupCheckoutSession: ICreateFollowupCheckoutUsecase,
    private readonly _errors: IHttpErrors,
    private readonly _success: IHttpSuccess
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const user_id = httpRequest.user?.id;
      const { lawyer_id, date, timeSlot, duration, reason, caseId } =
        (httpRequest.body as {
          lawyer_id?: string;
          date?: string;
          timeSlot?: string;
          duration?: number;
          reason?: string;
          caseId: string;
        }) || {};

      if (
        !lawyer_id ||
        !date ||
        !timeSlot ||
        !user_id ||
        !duration ||
        !reason ||
        !caseId
      ) {
        return this._errors.error_400("Invalid Credentials");
      }

      const dateObj = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      );

      const response = await this._createFollowupCheckoutSession.execute({
        client_id: user_id,
        date: dateObj,
        duration,
        lawyer_id,
        reason,
        timeSlot,
        caseId,
      });

      return this._success.success_200(response);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
