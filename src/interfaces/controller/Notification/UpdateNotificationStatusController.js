"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationStatusController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class UpdateNotificationStatusController {
    updateNotificationUseCase;
    httpErrors;
    httpSuccess;
    constructor(updateNotificationUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.updateNotificationUseCase = updateNotificationUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let status = false;
        let id = "";
        if (httpRequest &&
            httpRequest.body &&
            typeof httpRequest.body === "object" &&
            "status" in httpRequest.body &&
            typeof httpRequest.body.status === "boolean") {
            status = httpRequest.body.status;
        }
        if (httpRequest &&
            httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params &&
            typeof httpRequest.params.id === "string") {
            id = httpRequest.params.id;
        }
        try {
            const result = await this.updateNotificationUseCase.execute({
                id,
                status,
            });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.UpdateNotificationStatusController = UpdateNotificationStatusController;
