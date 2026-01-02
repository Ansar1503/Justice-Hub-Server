"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSpecializationsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAllSpecializationsQueryValidator_1 = require("@interfaces/middelwares/validator/zod/specialization/FetchAllSpecializationsQueryValidator");
class FetchAllSpecializationsController {
    FetchAllSpecializations;
    httpErrors;
    httpSuccess;
    constructor(FetchAllSpecializations, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.FetchAllSpecializations = FetchAllSpecializations;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const parsed = FetchAllSpecializationsQueryValidator_1.FetchAllSpecializationsQueryValidatorSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const error = parsed.error.errors[0];
            return this.httpErrors.error_400(error.message);
        }
        try {
            const result = await this.FetchAllSpecializations.execute(parsed.data);
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
exports.FetchAllSpecializationsController = FetchAllSpecializationsController;
