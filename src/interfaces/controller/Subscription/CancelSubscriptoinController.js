"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSubscriptionController = void 0;
class CancelSubscriptionController {
    _cancelSubscription;
    _errors;
    _success;
    constructor(_cancelSubscription, _errors, _success) {
        this._cancelSubscription = _cancelSubscription;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId.trim()) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._cancelSubscription.execute({ userId });
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.CancelSubscriptionController = CancelSubscriptionController;
