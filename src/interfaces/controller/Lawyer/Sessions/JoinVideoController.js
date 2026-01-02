"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinVideoSessionController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class JoinVideoSessionController {
    JoinSession;
    httpSuccess;
    httpErrors;
    constructor(JoinSession, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.JoinSession = JoinSession;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let userId = "";
        let sessionId = "";
        if (httpRequest.body &&
            typeof httpRequest.body === "object" &&
            "sessionId" in httpRequest.body) {
            sessionId = String(httpRequest.body.sessionId);
        }
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId) {
            return this.httpErrors.error_400("userId is required");
        }
        try {
            const result = await this.JoinSession.execute({ sessionId, userId });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof CustomError_1.AppError) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.JoinVideoSessionController = JoinVideoSessionController;
