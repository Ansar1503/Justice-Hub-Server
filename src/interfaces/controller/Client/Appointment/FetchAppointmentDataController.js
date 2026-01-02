"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAppointmentDataController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const zod_validate_1 = require("@interfaces/middelwares/validator/zod/zod.validate");
class FetchAppointmentDataController {
    fetchAppointments;
    httpErrors;
    httpSuccess;
    constructor(fetchAppointments, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchAppointments = fetchAppointments;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let user_id = "";
        if (httpRequest.user &&
            typeof httpRequest.user == "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id == "string" &&
            "role" in httpRequest.user &&
            httpRequest.user.role != "admin") {
            user_id = httpRequest.user.id;
        }
        const parsedData = zod_validate_1.zodAppointmentQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            const err = parsedData.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        try {
            const result = await this.fetchAppointments.execute({
                ...parsedData.data,
                user_id,
            });
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
exports.FetchAppointmentDataController = FetchAppointmentDataController;
