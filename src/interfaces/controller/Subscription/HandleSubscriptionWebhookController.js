"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleSubscribeWebhookController = void 0;
class HandleSubscribeWebhookController {
    _handleSubscribeWebhook;
    _errors;
    _success;
    constructor(_handleSubscribeWebhook, _errors, _success) {
        this._handleSubscribeWebhook = _handleSubscribeWebhook;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const signature = httpRequest.headers?.["stripe-signature"] ||
                httpRequest.headers?.["Stripe-Signature"];
            if (!signature) {
                return this._errors.error_400("Missing Stripe signature");
            }
            if (!signature) {
                return this._errors.error_400("Missing Stripe signature header");
            }
            await this._handleSubscribeWebhook.execute({
                rawBody: httpRequest.body,
                signature,
            });
            return this._success.success_200({ success: true });
        }
        catch (error) {
            console.log("errors", error);
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.HandleSubscribeWebhookController = HandleSubscribeWebhookController;
