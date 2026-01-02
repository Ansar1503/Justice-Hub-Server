"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveOverrideSlotsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class RemoveOverrideSlotsController {
    removeOverrideSlots;
    httpSuccess;
    httpErrors;
    constructor(removeOverrideSlots, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.removeOverrideSlots = removeOverrideSlots;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let user_id = "";
        let date = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        if (!httpRequest.params) {
            return this.httpErrors.error_400("Invalid Params");
        }
        if (typeof httpRequest.query === "object" && httpRequest.query !== null) {
            if ("date" in httpRequest.query) {
                date =
                    typeof httpRequest.query.date === "string"
                        ? httpRequest.query.date
                        : String(httpRequest.query.date);
            }
        }
        try {
            const response = await this.removeOverrideSlots.execute({
                lawyer_id: user_id,
                date: date,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "override slots removed",
                data: response,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.RemoveOverrideSlotsController = RemoveOverrideSlotsController;
