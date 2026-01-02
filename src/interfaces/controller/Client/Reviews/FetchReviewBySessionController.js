"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsBySessionController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchReviewsBySessionController {
    fetchReviewBySessionId;
    httpErrors;
    httpSuccess;
    constructor(fetchReviewBySessionId, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchReviewBySessionId = fetchReviewBySessionId;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const sessionId = httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                ? httpRequest.params.id
                : undefined;
            if (!sessionId) {
                const error = this.httpErrors.error_400();
                return error;
            }
            const result = await this.fetchReviewBySessionId.execute({
                session_id: sessionId,
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
exports.FetchReviewsBySessionController = FetchReviewsBySessionController;
