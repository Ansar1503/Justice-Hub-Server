"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class UpdatePasswordController {
    updatePassword;
    httpErrors;
    httpSuccess;
    constructor(updatePassword, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.updatePassword = updatePassword;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { password, currentPassword } = req.body;
        if (!password) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, {
                message: "password not found",
            });
        }
        if (!currentPassword) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, {
                message: "current password not found",
            });
        }
        try {
            const user_id = req.user?.id;
            const payload = { currentPassword, password, user_id };
            const response = await this.updatePassword.execute(payload);
            if (!response) {
                const err = this.httpErrors.error_400();
                return new HttpResponse_1.HttpResponse(err.statusCode, {
                    message: "Error Updating Password",
                });
            }
            const success = this.httpSuccess.success_200();
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.UpdatePasswordController = UpdatePasswordController;
