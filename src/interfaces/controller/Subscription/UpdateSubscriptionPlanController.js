"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanController = void 0;
const AddSubscriptionPlanZodValidation_1 = require("@interfaces/middelwares/validator/zod/Subscription/AddSubscriptionPlanZodValidation");
class UpdateSubscriptionPlanController {
    _updateSubscriptionPlan;
    _errors;
    _success;
    constructor(_updateSubscriptionPlan, _errors, _success) {
        this._updateSubscriptionPlan = _updateSubscriptionPlan;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const parsed = await AddSubscriptionPlanZodValidation_1.AddSubscriptionPlanZodInputSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const error = parsed.error.errors[0];
            return this._errors.error_400(error.message);
        }
        let id = "";
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id.trim()) {
            return this._errors.error_400("subscription plan Id not found");
        }
        try {
            const result = await this._updateSubscriptionPlan.execute({
                ...parsed.data,
                id: id,
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
exports.UpdateSubscriptionPlanController = UpdateSubscriptionPlanController;
