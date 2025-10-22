import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { ISubscriptionWebhookHanlderUsecase } from "@src/application/usecases/Subscription/ISubscriptionWebhookHandleUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class HandleSubscribeWebhookController implements IController {
  constructor(
    private _handleSubscribeWebhook: ISubscriptionWebhookHanlderUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const signature =
        (httpRequest.headers as any)?.["stripe-signature"] ||
        (httpRequest.headers as any)?.["Stripe-Signature"];

      if (!signature) {
        return this._errors.error_400("Missing Stripe signature");
      }
      if (!signature) {
        return this._errors.error_400("Missing Stripe signature header");
      }

      await this._handleSubscribeWebhook.execute({
        rawBody: httpRequest.body as any,
        signature,
      });
      return this._success.success_200({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }

      return this._errors.error_500();
    }
  }
}
