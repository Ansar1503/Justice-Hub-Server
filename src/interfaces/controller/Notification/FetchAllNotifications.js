"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllNotificationsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchAllNotificationsController {
    fetchAllNotificationsUseCase;
    httpErrors;
    httpSuccess;
    constructor(fetchAllNotificationsUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchAllNotificationsUseCase = fetchAllNotificationsUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let user_id = "";
        let cursor = 0;
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string") {
            user_id = httpRequest.user.id;
        }
        if (httpRequest.query && typeof httpRequest.query == "object" && "cursor" in httpRequest.query) {
            cursor = Number(httpRequest.query.cursor);
            if (isNaN(cursor)) {
                cursor = 1;
            }
        }
        try {
            const result = await this.fetchAllNotificationsUseCase.execute({
                user_id: user_id,
                cursor,
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
exports.FetchAllNotificationsController = FetchAllNotificationsController;
