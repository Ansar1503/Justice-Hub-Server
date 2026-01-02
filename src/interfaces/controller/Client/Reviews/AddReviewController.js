"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReviewController = void 0;
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class AddReviewController {
    addReview;
    httpErrors;
    httpSuccess;
    constructor(addReview, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.addReview = addReview;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const body = httpRequest.body;
            const client_id = body?.user?.id;
            const lawyer_id = body?.lawyerId;
            const { review, rating, sessionId, heading } = body;
            if (!client_id) {
                const error = this.httpErrors.error_403("unauthorised access");
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            if (!lawyer_id) {
                const error = this.httpErrors.error_400("lawyer not found");
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            if (!review || !rating || !heading) {
                const error = this.httpErrors.error_400("please provide a review");
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            if (!sessionId) {
                const error = this.httpErrors.error_400("You had no session with this lawyer");
                return new HttpResponse_1.HttpResponse(error.statusCode, error.body);
            }
            await this.addReview.execute({
                client_id,
                lawyer_id,
                rating,
                review,
                session_id: sessionId,
                heading,
            });
            const success = this.httpSuccess.success_200({ message: "review added" });
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            switch (error.message) {
                case "USER_EMPTY":
                    return new HttpResponse_1.HttpResponse(404, {
                        success: false,
                        message: "user is not found",
                    });
                case "USER_UNVERIFIED":
                    return new HttpResponse_1.HttpResponse(400, {
                        success: false,
                        message: "user email is not verified.",
                    });
                case "USER_BLOCKED":
                    return new HttpResponse_1.HttpResponse(403, {
                        success: false,
                        message: "user is blocked",
                    });
                case "LAWYER_EMPTY":
                    return new HttpResponse_1.HttpResponse(404, {
                        success: false,
                        message: "lawyer not found",
                    });
                case "LAWYER_UNVERIFIED":
                    return new HttpResponse_1.HttpResponse(400, {
                        success: false,
                        message: "lawyer is not verified",
                    });
                case "REVIEW_LIMIT_EXCEEDED":
                    return new HttpResponse_1.HttpResponse(400, {
                        success: false,
                        message: "review limit exceeded",
                    });
                default:
                    return new HttpResponse_1.HttpResponse(500, {
                        success: false,
                        message: "Internal server error",
                    });
            }
        }
    }
}
exports.AddReviewController = AddReviewController;
