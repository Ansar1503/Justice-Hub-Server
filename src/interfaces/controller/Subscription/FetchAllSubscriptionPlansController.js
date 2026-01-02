"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSubscriptionPlansController = void 0;
class FetchAllSubscriptionPlansController {
    _fetchAllSubscriptionPlans;
    _errors;
    _success;
    constructor(_fetchAllSubscriptionPlans, _errors, _success) {
        this._fetchAllSubscriptionPlans = _fetchAllSubscriptionPlans;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const result = await this._fetchAllSubscriptionPlans.execute();
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
exports.FetchAllSubscriptionPlansController = FetchAllSubscriptionPlansController;
