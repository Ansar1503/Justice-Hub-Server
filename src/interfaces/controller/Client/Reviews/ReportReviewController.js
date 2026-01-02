"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportReviewController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class ReportReviewController {
    reportReviewUseCase;
    httpErrors;
    httpSuccess;
    constructor(reportReviewUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.reportReviewUseCase = reportReviewUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const { id: review_id } = httpRequest.params;
            const { reason, reportedBy, reportedUser } = httpRequest.body;
            if (!review_id || review_id.trim() === "") {
                return this.httpErrors.error_400("reviewId required");
            }
            if (!reason || reason.trim() === "") {
                return this.httpErrors.error_400("reason required");
            }
            if (!reportedBy || reportedBy.trim() === "") {
                return this.httpErrors.error_400("reportedBy required");
            }
            if (!reportedUser || reportedUser.trim() === "") {
                return this.httpErrors.error_400("reportedUser required");
            }
            await this.reportReviewUseCase.execute({
                review_id,
                reason,
                reportedBy,
                reportedUser,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "Review reported ",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Something went wrong");
        }
    }
}
exports.ReportReviewController = ReportReviewController;
