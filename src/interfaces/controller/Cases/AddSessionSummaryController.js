"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSessionSummaryController = void 0;
class AddSessionSummaryController {
    _addSessionSummary;
    _errors;
    _success;
    constructor(_addSessionSummary, _errors, _success) {
        this._addSessionSummary = _addSessionSummary;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let sessionId = "";
        let summary = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("sessionId" in httpRequest.body) {
                sessionId = String(httpRequest.body.sessionId);
            }
            if ("summary" in httpRequest.body) {
                summary = String(httpRequest.body.summary);
            }
        }
        if (!sessionId.trim())
            return this._errors.error_400("no session id found");
        if (!summary.trim())
            return this._errors.error_400("no summary found");
        try {
            const result = await this._addSessionSummary.execute({
                sessionId,
                summary,
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
exports.AddSessionSummaryController = AddSessionSummaryController;
