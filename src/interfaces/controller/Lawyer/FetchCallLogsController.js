"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCallLogsController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchCallLogsController {
    FetchCallLogs;
    httpSuccess;
    httpErrors;
    constructor(FetchCallLogs, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpErrors = new HttpErrors_1.HttpErrors()) {
        this.FetchCallLogs = FetchCallLogs;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let id = "";
        let page = 1;
        let limit = 10;
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (httpRequest.query && typeof httpRequest.query === "object") {
            if ("page" in httpRequest.query) {
                page = !isNaN(Number(httpRequest.query.page)) ? Number(httpRequest.query.page) : 1;
            }
            if ("limit" in httpRequest.query) {
                limit = !isNaN(Number(httpRequest.query.limit)) ? Number(httpRequest.query.limit) : 10;
            }
        }
        if (!id) {
            return this.httpErrors.error_400("session id is required");
        }
        try {
            const result = await this.FetchCallLogs.execute({
                limit,
                page,
                sessionId: id,
            });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof CustomError_1.AppError) {
                return new HttpResponse_1.HttpResponse(error.statusCode, error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchCallLogsController = FetchCallLogsController;
