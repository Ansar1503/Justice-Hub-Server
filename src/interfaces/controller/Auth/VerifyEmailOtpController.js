"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailOtpController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class VerifyEmailOtpController {
    verifyEmailByOtpUseCase;
    httpErrors;
    httpSuccess;
    constructor(verifyEmailByOtpUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.verifyEmailByOtpUseCase = verifyEmailByOtpUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const { otpValue: otp, email } = httpRequest.body;
        if (!otp || !email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        try {
            await this.verifyEmailByOtpUseCase.execute({ email, otp });
            const success = this.httpSuccess.success_200();
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.VerifyEmailOtpController = VerifyEmailOtpController;
