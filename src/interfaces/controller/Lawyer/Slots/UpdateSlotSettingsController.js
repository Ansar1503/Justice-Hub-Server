"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLawyerSlotSettingsController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class UpdateLawyerSlotSettingsController {
    updateSlotSettings;
    httpSuccess;
    httpErrors;
    constructor(updateSlotSettings, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.updateSlotSettings = updateSlotSettings;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let user_id = "";
        let slotDuration = 0;
        let maxDaysInAdvance = 0;
        let autoConfirm = false;
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("slotDuration" in httpRequest.body) {
                if (typeof httpRequest.body.slotDuration === "number") {
                    slotDuration = httpRequest.body.slotDuration;
                }
                else if (typeof httpRequest.body.slotDuration === "string") {
                    slotDuration = parseInt(httpRequest.body.slotDuration);
                }
            }
            if ("maxDaysInAdvance" in httpRequest.body) {
                if (typeof httpRequest.body.maxDaysInAdvance === "number") {
                    maxDaysInAdvance = httpRequest.body.maxDaysInAdvance;
                }
                if (typeof httpRequest.body.maxDaysInAdvance === "string") {
                    maxDaysInAdvance = parseInt(httpRequest.body.maxDaysInAdvance);
                }
            }
            if ("autoConfirm" in httpRequest.body) {
                if (typeof httpRequest.body.autoConfirm === "boolean") {
                    autoConfirm = httpRequest.body.autoConfirm;
                }
                if (typeof httpRequest.body.autoConfirm === "string") {
                    autoConfirm = httpRequest.body.autoConfirm === "true" ? true : false;
                }
            }
        }
        if (!slotDuration || !maxDaysInAdvance || autoConfirm === undefined || autoConfirm === null) {
            return this.httpErrors.error_400("Provide required fields");
        }
        try {
            const slotSettings = await this.updateSlotSettings.execute({
                autoConfirm: autoConfirm,
                lawyer_id: user_id,
                maxDaysInAdvance: maxDaysInAdvance,
                slotDuration: slotDuration,
            });
            return this.httpSuccess.success_200(slotSettings);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.UpdateLawyerSlotSettingsController = UpdateLawyerSlotSettingsController;
