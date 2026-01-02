"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAppointmentByCaseController = void 0;
class FindAppointmentByCaseController {
    _findAppointmentByCase;
    _error;
    _success;
    constructor(_findAppointmentByCase, _error, _success) {
        this._findAppointmentByCase = _findAppointmentByCase;
        this._error = _error;
        this._success = _success;
    }
    async handle(httpRequest) {
        let caseId = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            caseId = String(httpRequest.params.id);
        }
        if (!caseId)
            return this._error.error_400("case id is required");
        try {
            const result = await this._findAppointmentByCase.execute(caseId);
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._error.error_400(error.message);
            }
            return this._error.error_500();
        }
    }
}
exports.FindAppointmentByCaseController = FindAppointmentByCaseController;
