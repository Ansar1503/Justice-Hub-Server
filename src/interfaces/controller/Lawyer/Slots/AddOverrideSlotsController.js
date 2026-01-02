"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOverrideSlotsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const zod_validate_1 = require("@interfaces/middelwares/validator/zod/zod.validate");
class AddOverrideSlotsController {
    addOverrideUsecase;
    httpSuccess;
    httpErrors;
    constructor(addOverrideUsecase, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.addOverrideUsecase = addOverrideUsecase;
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
        const payload = zod_validate_1.zodOverrideSlotsSchema.safeParse(httpRequest.body);
        if (!payload.success) {
            payload.error.errors.forEach((err) => {
                return this.httpErrors.error_400(err.message);
            });
            return this.httpErrors.error_400("invalid Credentials");
        }
        if (payload.data && Object.keys(payload.data).length === 0) {
            return this.httpErrors.error_400("invalid Credentials");
        }
        try {
            const response = await this.addOverrideUsecase.execute({
                overrideDates: payload.data,
                lawyer_id: user_id,
            });
            const body = {
                success: true,
                message: "override slot added",
                data: response,
            };
            return this.httpSuccess.success_200(body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.AddOverrideSlotsController = AddOverrideSlotsController;
