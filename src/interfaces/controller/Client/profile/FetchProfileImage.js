"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProfileImageController = void 0;
class FetchProfileImageController {
    _fetchProfile;
    _errors;
    _success;
    constructor(_fetchProfile, _errors, _success) {
        this._fetchProfile = _fetchProfile;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId) {
            return this._errors.error_400("userId is required");
        }
        try {
            const res = await this._fetchProfile.execute(userId);
            return this._success.success_200(res);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchProfileImageController = FetchProfileImageController;
