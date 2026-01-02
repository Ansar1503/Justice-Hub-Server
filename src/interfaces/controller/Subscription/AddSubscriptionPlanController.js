"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubscriptionPlanController = void 0;
const AddSubscriptionPlanZodValidation_1 = require("@interfaces/middelwares/validator/zod/Subscription/AddSubscriptionPlanZodValidation");
class AddSubscriptionPlanController {
    _addSubscriptionUsecase;
    _errors;
    _success;
    constructor(_addSubscriptionUsecase, _errors, _success) {
        this._addSubscriptionUsecase = _addSubscriptionUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const parsed = await AddSubscriptionPlanZodValidation_1.AddSubscriptionPlanZodInputSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._addSubscriptionUsecase.execute(parsed.data);
            return this._success.success_201(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.AddSubscriptionPlanController = AddSubscriptionPlanController;
