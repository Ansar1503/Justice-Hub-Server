"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchChatDisputesController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchChatDisputesZod_1 = require("@interfaces/middelwares/validator/zod/admin/FetchChatDisputesZod");
class FetchChatDisputesController {
    fetchChatDisputes;
    httpErrors;
    httpSuccess;
    constructor(fetchChatDisputes, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchChatDisputes = fetchChatDisputes;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const parsed = FetchChatDisputesZod_1.FetchChatDisputesQueryZodValidator.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        try {
            const response = await this.fetchChatDisputes.execute(parsed.data);
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
exports.FetchChatDisputesController = FetchChatDisputesController;
