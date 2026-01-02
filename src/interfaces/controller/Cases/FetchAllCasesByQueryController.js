"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasesByQueryController = void 0;
const FindCasesQuerySchema_1 = require("@interfaces/middelwares/validator/zod/Cases/FindCasesQuerySchema");
class FetchAllCasesByQueryController {
    _fetchCasesUsecase;
    _errors;
    _success;
    constructor(_fetchCasesUsecase, _errors, _success) {
        this._fetchCasesUsecase = _fetchCasesUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        const parsed = FindCasesQuerySchema_1.FindCasesQueryInputZodSchema.safeParse(httpRequest.query);
        if (!userId) {
            return this._errors.error_400("userId not found");
        }
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._fetchCasesUsecase.execute({
                ...parsed.data,
                userId: userId,
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
exports.FetchAllCasesByQueryController = FetchAllCasesByQueryController;
