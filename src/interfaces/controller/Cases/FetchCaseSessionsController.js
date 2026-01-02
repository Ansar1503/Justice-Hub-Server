"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseSessionController = void 0;
class FetchCaseSessionController {
    _fetchCaseSessions;
    _errors;
    _success;
    constructor(_fetchCaseSessions, _errors, _success) {
        this._fetchCaseSessions = _fetchCaseSessions;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let CaseId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            CaseId = String(httpRequest.params.id);
        }
        if (!CaseId)
            return this._errors.error_400("case id not found");
        try {
            const result = await this._fetchCaseSessions.execute(CaseId);
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
exports.FetchCaseSessionController = FetchCaseSessionController;
