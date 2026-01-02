"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeActiveSubscriptionStatusController = void 0;
class ChangeActiveSubscriptionStatusController {
    _changeActiveSubscriptionStatus;
    _errors;
    _success;
    constructor(_changeActiveSubscriptionStatus, _errors, _success) {
        this._changeActiveSubscriptionStatus = _changeActiveSubscriptionStatus;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const id = httpRequest?.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params
            ? String(httpRequest.params.id)
            : null;
        const status = httpRequest?.body &&
            typeof httpRequest.body === "object" &&
            "status" in httpRequest.body &&
            typeof httpRequest.body.status === "boolean"
            ? httpRequest.body.status
            : null;
        if (!id) {
            return this._errors.error_400("Subscription ID is required");
        }
        if (status === null) {
            return this._errors.error_400("Status is required");
        }
        try {
            const result = await this._changeActiveSubscriptionStatus.execute({
                id,
                status,
            });
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
exports.ChangeActiveSubscriptionStatusController = ChangeActiveSubscriptionStatusController;
