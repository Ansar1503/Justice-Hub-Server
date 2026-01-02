"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class CancelAppointmentController {
    cancelAppointment;
    httpErrors;
    httpSuccess;
    constructor(cancelAppointment, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.cancelAppointment = cancelAppointment;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const client_id = req.user?.id;
        if (!client_id) {
            return new HttpResponse_1.HttpResponse(400, { message: "Client Id not found" });
        }
        const { id, status } = req.body;
        if (!id || !status) {
            return new HttpResponse_1.HttpResponse(400, { message: "Credentials not found" });
        }
        try {
            const result = await this.cancelAppointment.execute({
                id,
                status,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.CancelAppointmentController = CancelAppointmentController;
