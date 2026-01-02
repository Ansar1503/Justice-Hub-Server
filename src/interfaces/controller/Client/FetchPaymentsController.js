"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPaymentsController = void 0;
const FetchPaymentsQueryValidation_1 = require("@interfaces/middelwares/validator/zod/FetchPaymentsQueryValidation");
class FetchPaymentsController {
    _fetchPaymentsUsecase;
    _errors;
    _success;
    constructor(_fetchPaymentsUsecase, _errors, _success) {
        this._fetchPaymentsUsecase = _fetchPaymentsUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this._errors.error_400("User id is required");
        }
        const parsed = await FetchPaymentsQueryValidation_1.fetchPaymentsQueryValidation.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.issues[0].message;
            return this._errors.error_400(err);
        }
        try {
            const data = await this._fetchPaymentsUsecase.execute({
                ...parsed.data,
                clientId: user_id,
            });
            return this._success.success_200(data);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchPaymentsController = FetchPaymentsController;
