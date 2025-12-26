import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IHandleStripeHookUseCase } from "@src/application/usecases/Client/IHandleStripeHookUseCase";
import { IController } from "../Interface/IController";

export class HandleWebhookController implements IController {
    constructor(private _handleWebHook: IHandleStripeHookUseCase) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const signature =
            (httpRequest.headers as any)?.["stripe-signature"] || (httpRequest.headers as any)?.["Stripe-Signature"];

        if (!signature) {
            return new HttpResponse(400, { message: "Missing Stripe signature" });
        }

        try {
            await this._handleWebHook.execute({ body: httpRequest.body, signature });
            return new HttpResponse(200, "Webhook received");
        } catch (error: any) {
            return new HttpResponse(400, "Webhook error");
        }
    }
}
