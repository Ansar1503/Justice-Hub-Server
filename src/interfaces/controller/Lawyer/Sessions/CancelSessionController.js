"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSessionController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class CancelSessionController {
    cancelSession;
    httpSuccess;
    httpErrors;
    constructor(cancelSession, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.cancelSession = cancelSession;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let id = "";
        if (httpRequest.body && typeof httpRequest.body === "object" && "id" in httpRequest.body) {
            id = String(httpRequest.body.id);
        }
        try {
            const result = await this.cancelSession.execute({ session_id: id });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof CustomError_1.AppError) {
                return new HttpResponse_1.HttpResponse(error.statusCode, error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.CancelSessionController = CancelSessionController;
