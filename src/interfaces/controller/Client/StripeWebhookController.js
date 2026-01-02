"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleWebhookController = void 0;
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class HandleWebhookController {
    handleWebHook;
    constructor(handleWebHook) {
        this.handleWebHook = handleWebHook;
    }
    async handle(httpRequest) {
        const signature = httpRequest.headers?.["stripe-signature"] || httpRequest.headers?.["Stripe-Signature"];
        if (!signature) {
            return new HttpResponse_1.HttpResponse(400, { message: "Missing Stripe signature" });
        }
        try {
            await this.handleWebHook.execute({ body: httpRequest.body, signature });
            return new HttpResponse_1.HttpResponse(200, "Webhook received");
        }
        catch (error) {
            return new HttpResponse_1.HttpResponse(400, "Webhook error");
        }
    }
}
exports.HandleWebhookController = HandleWebhookController;
