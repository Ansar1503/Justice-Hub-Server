"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationAsReadController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class MarkAllNotificationAsReadController {
    markAllNotificationAsReadUseCase;
    httpSuccess;
    httpError;
    constructor(markAllNotificationAsReadUseCase, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpError = new HttpErrors_1.HttpErrors()) {
        this.markAllNotificationAsReadUseCase = markAllNotificationAsReadUseCase;
        this.httpSuccess = httpSuccess;
        this.httpError = httpError;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string") {
            user_id = httpRequest.user.id;
        }
        try {
            const result = await this.markAllNotificationAsReadUseCase.execute(user_id);
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpError.error_400(error.message);
            }
            return this.httpError.error_500();
        }
    }
}
exports.MarkAllNotificationAsReadController = MarkAllNotificationAsReadController;
