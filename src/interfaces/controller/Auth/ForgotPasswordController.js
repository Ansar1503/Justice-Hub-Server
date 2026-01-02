"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordController = void 0;
class ForgotPasswordController {
    _forgotPasswordUsecase;
    _errors;
    _success;
    constructor(_forgotPasswordUsecase, _errors, _success) {
        this._forgotPasswordUsecase = _forgotPasswordUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let email = "";
        if (httpRequest.body &&
            typeof httpRequest.body === "object" &&
            "email" in httpRequest.body) {
            email = String(httpRequest.body.email);
        }
        if (!email.trim()) {
            return this._errors.error_400("Email Required");
        }
        try {
            const result = await this._forgotPasswordUsecase.execute({ email });
            return this._success.success_200({ message: "Verification Mail Send!" });
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.ForgotPasswordController = ForgotPasswordController;
