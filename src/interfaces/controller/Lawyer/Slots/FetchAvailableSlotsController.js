"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAvailableSlotsController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class FetchAvailableSlotsController {
    availableSlots;
    httpSuccess;
    httpErrors;
    constructor(availableSlots, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.availableSlots = availableSlots;
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
            const response = await this.availableSlots.execute(user_id);
            return this.httpSuccess.success_200({
                success: true,
                message: "fetched data",
                data: response,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_500(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchAvailableSlotsController = FetchAvailableSlotsController;
