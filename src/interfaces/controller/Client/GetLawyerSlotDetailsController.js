"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyerSlotDetailsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const errors_1 = require("@infrastructure/constant/errors");
class GetLawyerSlotDetailsController {
    fetchLawyerSlots;
    httpErrors;
    httpSuccess;
    constructor(fetchLawyerSlots, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchLawyerSlots = fetchLawyerSlots;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const lawyer_id = httpRequest.params?.id || "";
            const date = httpRequest.query?.date;
            const client_id = httpRequest.user?.id;
            if (!lawyer_id.trim() || !date || !client_id) {
                return this.httpErrors.error_400("Invalid Credentials");
            }
            const dateObj = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
            const result = await this.fetchLawyerSlots.execute({
                lawyer_id,
                date: dateObj,
                client_id,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "Lawyer slots fetched successfully",
                data: result,
            });
        }
        catch (error) {
            switch (error.message) {
                case errors_1.ERRORS.USER_NOT_FOUND:
                    return this.httpErrors.error_404("User not found");
                case errors_1.ERRORS.USER_BLOCKED:
                    return this.httpErrors.error_403("User is blocked");
                case errors_1.ERRORS.LAWYER_NOT_VERIFIED:
                    return this.httpErrors.error_400("Lawyer is not verified");
                default:
                    return this.httpErrors.error_500(error.message || "Internal Server Error");
            }
        }
    }
}
exports.GetLawyerSlotDetailsController = GetLawyerSlotDetailsController;
