"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsList = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchReviewsQueryValidataion_1 = require("@interfaces/middelwares/validator/zod/FetchReviewsQueryValidataion");
class FetchReviewsList {
    fetchReviews;
    httpErrors;
    httpSuccess;
    constructor(fetchReviews, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchReviews = fetchReviews;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let user_id = "";
        let role = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            "role" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
            role = httpRequest.user.role;
        }
        if (!httpRequest.query)
            return this.httpErrors.error_400("Invalid query");
        const parsed = FetchReviewsQueryValidataion_1.FetchReviewsQueryValidation.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        if (!user_id || !role) {
            return this.httpErrors.error_400("Invalid user");
        }
        try {
            const payload = { ...parsed.data, user_id, role };
            const result = await this.fetchReviews.execute(payload);
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Internal server error");
        }
    }
}
exports.FetchReviewsList = FetchReviewsList;
