"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
class GoogleAuthController {
    _authUsecase;
    _errors;
    _success;
    constructor(_authUsecase, _errors, _success) {
        this._authUsecase = _authUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let credential = "";
        if (httpRequest.body && typeof httpRequest.body === "object" && "credential" in httpRequest.body) {
            credential = String(httpRequest.body.credential);
        }
        if (!credential) {
            return this._errors.error_400("no credential found");
        }
        try {
            const result = await this._authUsecase.execute({ credential });
            return this._success.success_200({
                success: true,
                message: "Google Auth Success",
                accesstoken: result.accesstoken,
                refreshToken: result.refreshToken,
                user: result.user
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.GoogleAuthController = GoogleAuthController;
