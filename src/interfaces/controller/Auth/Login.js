"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class LoginController {
    loginUseCase;
    httpErrors;
    httpSuccess;
    constructor(loginUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.loginUseCase = loginUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const { email, password } = httpRequest.body;
        if (!email || !password) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        try {
            const responsedata = await this.loginUseCase.execute({
                email: email.toLowerCase(),
                password,
            });
            const success = this.httpSuccess.success_200(responsedata);
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
exports.LoginController = LoginController;
