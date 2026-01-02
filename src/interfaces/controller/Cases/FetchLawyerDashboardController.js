"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerDashboardDataController = void 0;
class FetchLawyerDashboardDataController {
    _fetchLawyerDashboardData;
    _errors;
    _success;
    constructor(_fetchLawyerDashboardData, _errors, _success) {
        this._fetchLawyerDashboardData = _fetchLawyerDashboardData;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._fetchLawyerDashboardData.execute(userId);
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
exports.FetchLawyerDashboardDataController = FetchLawyerDashboardDataController;
