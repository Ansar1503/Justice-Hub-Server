"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class RefreshToken {
    userReAuth;
    httpErrors;
    httpSuccess;
    constructor(userReAuth, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.userReAuth = userReAuth;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const token = httpRequest?.cookies?.refresh;
        if (!token) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        try {
            const accesstoken = await this.userReAuth.execute(token);
            if (!accesstoken) {
                const err = this.httpErrors.error_400();
                return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
            }
            const success = this.httpSuccess.success_200(accesstoken);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.RefreshToken = RefreshToken;
