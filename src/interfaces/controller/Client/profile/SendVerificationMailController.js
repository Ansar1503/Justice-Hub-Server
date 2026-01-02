"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendVerificationMailController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class SendVerificationMailController {
    verifyMail;
    httpErrors;
    httpSuccess;
    constructor(verifyMail, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.verifyMail = verifyMail;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { email } = req.body;
        if (!email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        const user_id = req.user?.id;
        try {
            await this.verifyMail.execute({ email, user_id });
            const success = this.httpSuccess.success_200();
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, {
                message: "Error verifying email",
            });
        }
    }
}
exports.SendVerificationMailController = SendVerificationMailController;
