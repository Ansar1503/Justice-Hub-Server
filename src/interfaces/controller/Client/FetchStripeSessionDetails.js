"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStripeSessionDetailsController = void 0;
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchStripeSessionDetailsController {
    FetchStripeSessionDetails;
    constructor(FetchStripeSessionDetails) {
        this.FetchStripeSessionDetails = FetchStripeSessionDetails;
    }
    async handle(httpRequest) {
        const session_id = httpRequest.params?.id;
        if (!session_id) {
            return new HttpResponse_1.HttpResponse(400, {
                success: false,
                message: "Please provide session id",
            });
        }
        try {
            const response = await this.FetchStripeSessionDetails.execute(session_id);
            return new HttpResponse_1.HttpResponse(200, response);
        }
        catch (error) {
            switch (error.message) {
                case "SECRETKEYNOTFOUND":
                    return new HttpResponse_1.HttpResponse(400, {
                        success: false,
                        message: "SecretKey Not Found",
                    });
                default:
                    return new HttpResponse_1.HttpResponse(500, {
                        success: false,
                        message: "Internal Server Error",
                    });
            }
        }
    }
}
exports.FetchStripeSessionDetailsController = FetchStripeSessionDetailsController;
