"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class UpdateReviewsController {
    updateReview;
    httpErrors;
    httpSuccess;
    constructor(updateReview, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.updateReview = updateReview;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const reviewId = httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                ? httpRequest.params.id
                : undefined;
            const body = httpRequest.body && typeof httpRequest.body === "object" ? httpRequest.body : undefined;
            if (!reviewId) {
                const error = this.httpErrors.error_400("review id not found");
                return error;
            }
            if (!body || !body.heading || !body.review || typeof body.rating !== "number") {
                const error = this.httpErrors.error_400("invalid payload");
                return error;
            }
            const updates = {
                session_id: body.session_id,
                heading: body.heading,
                review: body.review,
                rating: body.rating,
                client_id: body.client_id,
                lawyer_id: body.lawyer_id,
            };
            const result = await this.updateReview.execute({
                review_id: reviewId,
                updates,
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
exports.UpdateReviewsController = UpdateReviewsController;
