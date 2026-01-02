"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectClientAppointmentController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class RejectClientAppointmentController {
    RejectAppointment;
    httpSuccess;
    httpErrors;
    constructor(RejectAppointment, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.RejectAppointment = RejectAppointment;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let id = "";
        let status = "";
        if (!httpRequest.body) {
            return this.httpErrors.error_400("Invalid query");
        }
        if (typeof httpRequest.body === "object" && "id" in httpRequest.body) {
            id = String(httpRequest.body.id);
        }
        if (typeof httpRequest.body === "object" && "status" in httpRequest.body) {
            if (httpRequest.body.status === "confirmed" ||
                httpRequest.body.status === "pending" ||
                httpRequest.body.status === "completed" ||
                httpRequest.body.status === "cancelled" ||
                httpRequest.body.status === "rejected") {
                status = httpRequest.body.status;
            }
        }
        if (!id || !status) {
            return this.httpErrors.error_400("Invalid Credentials");
        }
        try {
            const result = await this.RejectAppointment.execute({
                id,
                status,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "rejected appointnment",
                data: result,
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
exports.RejectClientAppointmentController = RejectClientAppointmentController;
