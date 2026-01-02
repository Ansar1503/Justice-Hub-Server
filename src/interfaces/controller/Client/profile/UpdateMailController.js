"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class UpdateEmailController {
    changeEmail;
    httpErrors;
    httpSuccess;
    constructor(changeEmail, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.changeEmail = changeEmail;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { email } = req?.body;
        if (!email) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        const user_id = req.user?.id;
        try {
            const responserUser = await this.changeEmail.execute({ email, user_id });
            if (!responserUser) {
                const err = this.httpErrors.error_400();
                return new HttpResponse_1.HttpResponse(err.statusCode, {
                    message: "error changing mail",
                });
            }
            const success = this.httpSuccess.success_200(responserUser);
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
exports.UpdateEmailController = UpdateEmailController;
