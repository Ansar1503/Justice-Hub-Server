"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerCalendarAvailabilityController = void 0;
class FetchLawyerCalendarAvailabilityController {
    _usecase;
    _errors;
    _success;
    constructor(_usecase, _errors, _success) {
        this._usecase = _usecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const { lawyerId } = httpRequest.params;
        const { month } = httpRequest.query;
        if (!lawyerId)
            return this._errors.error_400("llawyer id is required");
        try {
            const result = await this._usecase.execute({ lawyerId, month });
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
exports.FetchLawyerCalendarAvailabilityController = FetchLawyerCalendarAvailabilityController;
