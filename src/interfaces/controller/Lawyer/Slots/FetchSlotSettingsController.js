"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSlotSettingsController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class FetchSlotSettingsController {
    slotSettings;
    httpSuccess;
    httpErrors;
    constructor(slotSettings, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.slotSettings = slotSettings;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            user_id = String(httpRequest.params.id);
        }
        else if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        try {
            const response = await this.slotSettings.execute(user_id);
            return this.httpSuccess.success_200({
                success: true,
                message: "data fetched",
                data: response || {},
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
exports.FetchSlotSettingsController = FetchSlotSettingsController;
