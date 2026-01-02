"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessionsDocumentsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchSessionsDocumentsController {
    fetchSessionDocuments;
    httpErrors;
    httpSuccess;
    constructor(fetchSessionDocuments, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchSessionDocuments = fetchSessionDocuments;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { id: session_id } = req.params;
        if (!session_id) {
            return new HttpResponse_1.HttpResponse(400, { message: "session id not found" });
        }
        try {
            const result = await this.fetchSessionDocuments.execute(session_id);
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.FetchSessionsDocumentsController = FetchSessionsDocumentsController;
