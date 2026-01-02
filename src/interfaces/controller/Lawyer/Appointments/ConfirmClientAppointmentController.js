"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmClientAppointment = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class ConfirmClientAppointment {
    confirmAppointment;
    httpSuccess;
    httpErrors;
    constructor(confirmAppointment, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.confirmAppointment = confirmAppointment;
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
            const result = await this.confirmAppointment.execute({
                id,
                status,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "session created",
                data: result,
            });
        }
        catch (error) {
            if (error && typeof error === "object" && "code" in error && "message" in error) {
                const statusCode = typeof error?.code === "number" && error.code >= 100 && error.code < 600 ? error.code : 500;
                return new HttpResponse_1.HttpResponse(statusCode, { message: error.message });
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.ConfirmClientAppointment = ConfirmClientAppointment;
