"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchOverrideSlots = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchOverrideSlots {
    fetchOverrideSlots;
    httpSuccess;
    httpErrors;
    constructor(fetchOverrideSlots, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.fetchOverrideSlots = fetchOverrideSlots;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        try {
            const response = await this.fetchOverrideSlots.execute(user_id);
            return this.httpSuccess.success_200(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchOverrideSlots = FetchOverrideSlots;
