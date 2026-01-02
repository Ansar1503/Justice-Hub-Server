"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveSessionDocumentController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class RemoveSessionDocumentController {
    removeSessionDocument;
    httpErrors;
    httpSuccess;
    constructor(removeSessionDocument, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.removeSessionDocument = removeSessionDocument;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { id: documentId } = req.params;
        const { session } = req.query;
        if (!documentId) {
            return new HttpResponse_1.HttpResponse(400, { message: "document id not found" });
        }
        if (!session) {
            return new HttpResponse_1.HttpResponse(400, { message: "session id not found" });
        }
        try {
            const result = await this.removeSessionDocument.execute({
                documentId: documentId,
                sessionId: String(session),
            });
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
exports.RemoveSessionDocumentController = RemoveSessionDocumentController;
