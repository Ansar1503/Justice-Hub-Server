import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class HandleWebhookController implements IController {
  constructor(private clientUsecase: I_clientUsecase) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const signature = (
      httpRequest.header as Record<string, string> | undefined
    )?.["stripe-signature"];

    if (!signature) {
      return new HttpResponse(400, { message: "Missing Stripe signature" });
    }

    try {
      await this.clientUsecase.handleStripeHook(httpRequest.body, signature);
      return new HttpResponse(200, "Webhook received");
    } catch (error: any) {
      console.error("Webhook error:", error);
      return new HttpResponse(400, "Webhook error");
    }
  }
}
