"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseDetailsControlller = void 0;
class FetchCaseDetailsControlller {
    _findCaseDetailsUsecase;
    _errors;
    _success;
    constructor(_findCaseDetailsUsecase, _errors, _success) {
        this._findCaseDetailsUsecase = _findCaseDetailsUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let caseId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            caseId = String(httpRequest.params.id);
        }
        if (!caseId?.trim()) {
            return this._errors.error_400("caseId not found");
        }
        try {
            const result = await this._findCaseDetailsUsecase.execute(caseId);
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
exports.FetchCaseDetailsControlller = FetchCaseDetailsControlller;
