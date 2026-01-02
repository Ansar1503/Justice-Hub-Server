"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordController = void 0;
class ResetPasswordController {
    _resetPasswordUsecase;
    _errors;
    _success;
    constructor(_resetPasswordUsecase, _errors, _success) {
        this._resetPasswordUsecase = _resetPasswordUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let token = "";
        let password = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("token" in httpRequest.body) {
                token = String(httpRequest.body.token);
            }
            if ("password" in httpRequest.body) {
                password = String(httpRequest.body.password);
            }
        }
        if (!token || !password) {
            return this._errors.error_400("Invalid credentials");
        }
        try {
            await this._resetPasswordUsecase.execute({ token, password });
            return this._success.success_200({
                message: "Password Reset Successfully",
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
exports.ResetPasswordController = ResetPasswordController;
