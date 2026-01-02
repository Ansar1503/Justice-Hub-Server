"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyersVerificationDataController = void 0;
class FetchLawyersVerificationDataController {
    _fetchVerificationDataUsecase;
    _errors;
    _success;
    constructor(_fetchVerificationDataUsecase, _errors, _success) {
        this._fetchVerificationDataUsecase = _fetchVerificationDataUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            if (typeof httpRequest.params.id === "object") {
                return this._errors.error_400("invalid userid type");
            }
            userId = String(httpRequest.params.id);
        }
        if (!userId) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._fetchVerificationDataUsecase.execute(userId);
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
exports.FetchLawyersVerificationDataController = FetchLawyersVerificationDataController;
