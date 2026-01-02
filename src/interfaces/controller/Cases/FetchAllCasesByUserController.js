"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasesByUserController = void 0;
class FetchAllCasesByUserController {
    _fetchAllCasesByUser;
    _errors;
    _success;
    constructor(_fetchAllCasesByUser, _errors, _success) {
        this._fetchAllCasesByUser = _fetchAllCasesByUser;
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
        if (!userId)
            return this._errors.error_400("user id not found");
        try {
            const result = await this._fetchAllCasesByUser.execute(userId);
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
exports.FetchAllCasesByUserController = FetchAllCasesByUserController;
