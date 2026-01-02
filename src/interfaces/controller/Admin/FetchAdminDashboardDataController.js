"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminDashboardDataController = void 0;
class FetchAdminDashboardDataController {
    _fetchDashboardData;
    _errors;
    _success;
    constructor(_fetchDashboardData, _errors, _success) {
        this._fetchDashboardData = _fetchDashboardData;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const query = httpRequest.query;
        const { startDate, endDate } = query;
        if (!startDate || !endDate) {
            return this._errors.error_400("startDate and endDate are required query parameters");
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return this._errors.error_400("Invalid date format. Use ISO format (YYYY-MM-DD)");
        }
        try {
            const data = await this._fetchDashboardData.execute({ start, end });
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
exports.FetchAdminDashboardDataController = FetchAdminDashboardDataController;
