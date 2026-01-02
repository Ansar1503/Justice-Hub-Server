"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCurrentUserSubscriptionController = void 0;
class FetchCurrentUserSubscriptionController {
    _fetchUserSubscription;
    _errors;
    _success;
    constructor(_fetchUserSubscription, _errors, _success) {
        this._fetchUserSubscription = _fetchUserSubscription;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userID = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userID = String(httpRequest.user.id);
        }
        if (!userID)
            return this._errors.error_400("user id not found");
        try {
            const resuls = await this._fetchUserSubscription.execute(userID);
            return this._success.success_200(resuls);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchCurrentUserSubscriptionController = FetchCurrentUserSubscriptionController;
