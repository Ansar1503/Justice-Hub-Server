"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartSessionController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class StartSessionController {
    startSessionUseCase;
    httpSuccess;
    httpErrors;
    constructor(startSessionUseCase, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.startSessionUseCase = startSessionUseCase;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let sessionId = "";
        if (httpRequest.body && typeof httpRequest.body === "object" && "sessionId" in httpRequest.body) {
            sessionId = String(httpRequest.body.sessionId);
        }
        if (!sessionId) {
            return this.httpErrors.error_400("session id is required");
        }
        try {
            const result = await this.startSessionUseCase.execute({ sessionId });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof CustomError_1.AppError) {
                return new HttpResponse_1.HttpResponse(error.statusCode, error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.StartSessionController = StartSessionController;
