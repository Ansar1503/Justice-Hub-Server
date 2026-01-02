"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class ResendOtpController {
    resendOtpUseCase;
    httpErrors;
    httpSuccess;
    constructor(resendOtpUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.resendOtpUseCase = resendOtpUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const { email } = httpRequest.body;
        if (!email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        try {
            await this.resendOtpUseCase.execute(email?.toLowerCase());
            const success = this.httpSuccess.success_200();
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.ResendOtpController = ResendOtpController;
