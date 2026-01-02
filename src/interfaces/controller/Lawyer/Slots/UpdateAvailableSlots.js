"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailableSlotsController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const UpdateAvailableSlotSchema_1 = require("@interfaces/middelwares/validator/zod/lawyer/UpdateAvailableSlotSchema");
class UpdateAvailableSlotsController {
    updateAvailableSlots;
    httpSuccess;
    httpErrors;
    constructor(updateAvailableSlots, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.updateAvailableSlots = updateAvailableSlots;
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
            const parsed = UpdateAvailableSlotSchema_1.UpdateAvailableSlotsBodyValidateSchema.safeParse(httpRequest.body);
            if (!parsed.success) {
                const err = parsed.error.errors[0];
                return this.httpErrors.error_400(err.message);
            }
            const payload = { ...parsed.data, lawyer_id: user_id };
            const result = await this.updateAvailableSlots.execute(payload);
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_500(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.UpdateAvailableSlotsController = UpdateAvailableSlotsController;
