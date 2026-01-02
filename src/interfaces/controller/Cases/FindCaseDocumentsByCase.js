"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseDocumentsByCaseController = void 0;
const CaseDocumentsQuerySchema_1 = require("@interfaces/middelwares/validator/zod/Cases/CaseDocumentsQuerySchema");
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
class FindCaseDocumentsByCaseController {
    _findCaseDocuments;
    _errors;
    _success;
    constructor(_findCaseDocuments, _errors, _success) {
        this._findCaseDocuments = _findCaseDocuments;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let caseId = "";
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            caseId = String(httpRequest.params.id);
        }
        const parsed = CaseDocumentsQuerySchema_1.FetchCasesDocumentsByCaseInputZodSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            WinstonLoggerConfig_1.WLogger.error(er.message, er);
            return this._errors.error_400(er.message);
        }
        if (!caseId) {
            WinstonLoggerConfig_1.WLogger.error("Case Id not found", {
                page: "FindCaseDocumentsByCaseController",
            });
            throw new Error("case id not found");
        }
        try {
            const result = await this._findCaseDocuments.execute({
                ...parsed.data,
                caseId,
            });
            WinstonLoggerConfig_1.WLogger.info("Results found", result);
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
exports.FindCaseDocumentsByCaseController = FindCaseDocumentsByCaseController;
