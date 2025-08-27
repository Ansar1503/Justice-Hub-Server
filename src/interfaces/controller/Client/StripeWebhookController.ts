import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IHandleStripeHookUseCase } from "@src/application/usecases/Client/IHandleStripeHookUseCase";

export class HandleWebhookController implements IController {
  constructor(private handleWebHook: IHandleStripeHookUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const signature = (
      httpRequest.header as Record<string, string> | undefined
    )?.["stripe-signature"];

    if (!signature) {
      return new HttpResponse(400, { message: "Missing Stripe signature" });
    }

    try {
      await this.handleWebHook.execute({ body: httpRequest.body, signature });
      return new HttpResponse(200, "Webhook received");
    } catch (error: any) {
      console.error("Webhook error:", error);
      return new HttpResponse(400, "Webhook error");
    }
  }
}
