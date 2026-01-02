"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewDisputes = void 0;
const zod_validate_1 = require("@interfaces/middelwares/validator/zod/zod.validate");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class FetchReviewDisputes {
    FetchReviewDisputesUseCase;
    httpSuccess;
    httpErrors;
    constructor(FetchReviewDisputesUseCase, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.FetchReviewDisputesUseCase = FetchReviewDisputesUseCase;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        const parsedData = zod_validate_1.zodReviewDisputesQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            // console.log("parsed Error :", parsedData.error);
            const err = parsedData.error.errors[0].message;
            return this.httpErrors.error_400(err);
        }
        try {
            const result = await this.FetchReviewDisputesUseCase.execute(parsedData.data);
            const success = this.httpSuccess.success_200(result);
            return success;
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchReviewDisputes = FetchReviewDisputes;
