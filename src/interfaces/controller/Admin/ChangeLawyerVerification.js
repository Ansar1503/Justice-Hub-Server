"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLawyerVerificationStatusController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class ChangeLawyerVerificationStatusController {
    ChangeLawyerVerificationUseCase;
    httpError;
    httpSuccess;
    constructor(ChangeLawyerVerificationUseCase, httpError = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.ChangeLawyerVerificationUseCase = ChangeLawyerVerificationUseCase;
        this.httpError = httpError;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const { user_id, status, rejectReason } = httpRequest.body;
        if (!user_id) {
            const error = this.httpError.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, "UserId not found");
        }
        if (!status || !["verified", "rejected", "pending", "requested"].includes(status)) {
            const error = this.httpError.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, "Status not found or Invalid status");
        }
        try {
            const result = await this.ChangeLawyerVerificationUseCase.execute({
                user_id,
                status,
                rejectReason,
            });
            if (!result) {
                const error = this.httpError.error_400();
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            else {
                const success = this.httpSuccess.success_200(result);
                return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpError.error_400(error.message);
            }
            return this.httpError.error_500();
        }
    }
}
exports.ChangeLawyerVerificationStatusController = ChangeLawyerVerificationStatusController;
