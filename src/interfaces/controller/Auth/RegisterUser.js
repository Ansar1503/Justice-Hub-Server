"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const user_dto_1 = require("@src/application/dtos/user.dto");
class RegisterUser {
    registerUseCase;
    httpErrors;
    httpSuccess;
    constructor(registerUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.registerUseCase = registerUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        if (!httpRequest.body || typeof httpRequest.body !== "object") {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        const payload = {};
        if (typeof httpRequest.body === "object" && httpRequest.body !== null) {
            if ("name" in httpRequest.body && typeof httpRequest.body.name === "string") {
                payload.name = httpRequest.body.name;
            }
            if ("email" in httpRequest.body && typeof httpRequest.body.email === "string") {
                payload.email = httpRequest.body.email;
            }
            if ("mobile" in httpRequest.body && typeof httpRequest.body.mobile === "string") {
                payload.mobile = httpRequest.body.mobile;
            }
            if ("role" in httpRequest.body) {
                if (httpRequest.body.role === "admin") {
                    payload.role = httpRequest.body.role;
                }
                if (httpRequest.body.role === "lawyer") {
                    payload.role = httpRequest.body.role;
                }
                if (httpRequest.body.role === "client") {
                    payload.role = httpRequest.body.role;
                }
            }
            if ("password" in httpRequest.body && typeof httpRequest.body.password === "string") {
                payload.password = httpRequest.body.password;
            }
        }
        try {
            if (!payload.email || !payload.mobile || !payload.name || !payload.password || !payload.role) {
                return this.httpErrors.error_400("Invalid Credentials");
            }
            const dto = new user_dto_1.RegisterUserDto(payload);
            const user = await this.registerUseCase.execute(dto);
            if (!user) {
                const err = this.httpErrors.error_500();
                return new HttpResponse_1.HttpResponse(err.statusCode, {
                    message: "Error Registering User",
                });
            }
            const success = this.httpSuccess.success_201(user);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Error Registering User");
        }
    }
}
exports.RegisterUser = RegisterUser;
