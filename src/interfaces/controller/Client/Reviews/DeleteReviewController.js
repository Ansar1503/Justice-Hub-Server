"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReviewController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class DeleteReviewController {
    deleteReview;
    httpErrors;
    httpSuccess;
    constructor(deleteReview, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.deleteReview = deleteReview;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const reviewId = httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                ? httpRequest.params.id
                : undefined;
            if (!reviewId) {
                const error = this.httpErrors.error_400();
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            const result = await this.deleteReview.execute({
                review_id: reviewId,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.DeleteReviewController = DeleteReviewController;
