"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchReviewsController {
    fetchReviews;
    httpErrors;
    httpSuccess;
    constructor(fetchReviews, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchReviews = fetchReviews;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const lawyer_id = httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                ? httpRequest.params.id
                : undefined;
            const cursor = httpRequest.query && typeof httpRequest.query === "object" && "cursor" in httpRequest.query
                ? httpRequest.query.cursor
                : undefined;
            if (!lawyer_id || !cursor) {
                const err = this.httpErrors.error_400("Please provide lawyer_id and cursor.");
                return err;
            }
            const result = await this.fetchReviews.execute({
                lawyer_id,
                page: Number(cursor),
            });
            const success = this.httpSuccess.success_200(result);
            return success;
        }
        catch (error) {
            // console.log("error in fetch reviews controller",error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchReviewsController = FetchReviewsController;
