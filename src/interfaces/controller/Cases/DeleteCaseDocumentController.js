"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseDocumentsController = void 0;
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
class DeleteCaseDocumentsController {
    _deleteCaseDocument;
    _errors;
    _success;
    constructor(_deleteCaseDocument, _errors, _success) {
        this._deleteCaseDocument = _deleteCaseDocument;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        let documentId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            documentId = String(httpRequest.params.id);
        }
        if (!documentId) {
            WinstonLoggerConfig_1.WLogger.warn("document Id not found", {
                page: "Delete Case docs controller",
            });
            return this._errors.error_400("document id not found");
        }
        try {
            const result = await this._deleteCaseDocument.execute({
                documentId: documentId,
                userId: userId,
            });
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.DeleteCaseDocumentsController = DeleteCaseDocumentsController;
