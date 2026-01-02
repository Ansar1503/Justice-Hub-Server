"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCommissionSettingsController = void 0;
class FetchCommissionSettingsController {
    _fetchCommisionsettings;
    _errors;
    _success;
    constructor(_fetchCommisionsettings, _errors, _success) {
        this._fetchCommisionsettings = _fetchCommisionsettings;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const result = await this._fetchCommisionsettings.execute(null);
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
exports.FetchCommissionSettingsController = FetchCommissionSettingsController;
