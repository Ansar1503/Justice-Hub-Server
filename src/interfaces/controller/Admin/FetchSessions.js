"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessions = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const zod_validate_1 = require("@interfaces/middelwares/validator/zod/zod.validate");
class FetchSessions {
    fetchSessionUseCase;
    httpSuccess;
    httpErrors;
    constructor(fetchSessionUseCase, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.fetchSessionUseCase = fetchSessionUseCase;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string" &&
            "role" in httpRequest.user &&
            httpRequest.user.role !== "admin") {
            user_id = httpRequest.user.id;
        }
        const parsedData = zod_validate_1.zodSessionQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            const err = parsedData.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        try {
            if (!parsedData.data) {
                return this.httpErrors.error_400("Invalid Credentials");
            }
            const result = await this.fetchSessionUseCase.execute({
                ...parsedData.data,
                user_id,
            });
            // console.log("result", result);
            const success = this.httpSuccess.success_200(result);
            return success;
        }
        catch (error) {
            // console.log("error:", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchSessions = FetchSessions;
