"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribePlanController = void 0;
class SubscribePlanController {
    _subscribePlan;
    _errors;
    _success;
    constructor(_subscribePlan, _errors, _success) {
        this._subscribePlan = _subscribePlan;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        let planId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (httpRequest.body &&
            typeof httpRequest.body === "object" &&
            "planId" in httpRequest.body) {
            planId = String(httpRequest.body.planId);
        }
        if (!userId || !planId) {
            return this._errors.error_400("Invalid Credentials");
        }
        try {
            const result = await this._subscribePlan.execute({ planId, userId });
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
exports.SubscribePlanController = SubscribePlanController;
