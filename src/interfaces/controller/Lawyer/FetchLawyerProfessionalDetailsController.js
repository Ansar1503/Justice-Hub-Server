"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerProfessionalDetailsController = void 0;
class FetchLawyerProfessionalDetailsController {
    _usecase;
    _errors;
    _success;
    constructor(_usecase, _errors, _success) {
        this._usecase = _usecase;
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
            const result = await this._usecase.execute(userId);
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
exports.FetchLawyerProfessionalDetailsController = FetchLawyerProfessionalDetailsController;
