"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyerDetailController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class GetLawyerDetailController {
    getLawyerDetails;
    httpErrors;
    httpSuccess;
    constructor(getLawyerDetails, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.getLawyerDetails = getLawyerDetails;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            const { id } = httpRequest.params;
            try {
                const response = await this.getLawyerDetails.execute(id);
                return new HttpResponse_1.HttpResponse(200, {
                    success: true,
                    message: "lawyer data fetch successful",
                    data: response || {},
                });
            }
            catch (error) {
                switch (error.message) {
                    case "USER_NOT_FOUND":
                        return new HttpResponse_1.HttpResponse(404, {
                            success: false,
                            message: "lawyer not found",
                        });
                    case "USER_BLOCKED":
                        return new HttpResponse_1.HttpResponse(400, {
                            success: false,
                            message: "Lawyer is blocked",
                        });
                    case "LAWYER_UNAVAILABLE":
                        return new HttpResponse_1.HttpResponse(404, {
                            success: false,
                            message: "lawyer is unavailable at the moment",
                        });
                    case "LAWYER_UNVERIFIED":
                        return new HttpResponse_1.HttpResponse(400, {
                            success: false,
                            message: "lawyer is not verified",
                        });
                    default:
                        return new HttpResponse_1.HttpResponse(500, {
                            success: false,
                            message: "Internal Server Error",
                        });
                }
            }
        }
        return new HttpResponse_1.HttpResponse(400, {
            success: false,
            message: "invalid credentials",
        });
    }
}
exports.GetLawyerDetailController = GetLawyerDetailController;
