"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailController = void 0;
require("dotenv/config");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class VerifyEmailController {
    verifyMaiUseCase;
    httpErrors;
    httpSuccess;
    constructor(verifyMaiUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.verifyMaiUseCase = verifyMaiUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const { token, email } = httpRequest.query;
        if (!token || !email) {
            const errr = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(errr.statusCode, {
                redirectUrl: `${process.env.FRONTEND_URL}/email-validation-error?error=invalid&email=${email}`,
                message: "Invalid Credentials",
            });
        }
        try {
            await this.verifyMaiUseCase.execute({
                email,
                token,
            });
            const success = this.httpSuccess.success_200({
                redirectUrl: `${process.env.FRONTEND_URL}/email-verified`,
            });
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.VerifyEmailController = VerifyEmailController;
