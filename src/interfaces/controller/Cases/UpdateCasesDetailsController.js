"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCaseDetailsController = void 0;
const UpdateCasesDetailsFormSchema_1 = require("@interfaces/middelwares/validator/zod/Cases/UpdateCasesDetailsFormSchema");
class UpdateCaseDetailsController {
    _updateCaseDetailsUsecase;
    _errors;
    _success;
    constructor(_updateCaseDetailsUsecase, _errors, _success) {
        this._updateCaseDetailsUsecase = _updateCaseDetailsUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let caseId = "";
        if (httpRequest?.params && typeof httpRequest.params === "object" && 'id' in httpRequest.params) {
            caseId = String(httpRequest.params.id);
        }
        if (!caseId.trim()) {
            return this._errors.error_400("case Id is required");
        }
        const parsed = await UpdateCasesDetailsFormSchema_1.UpdateCasesDetailsFormSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const er = parsed.error.issues[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._updateCaseDetailsUsecase.execute({ ...parsed.data, caseId });
            return this._success.success_200(result);
        }
        catch (error) {
            console.log("errors", error);
            if (error instanceof Error) {
                return this._errors.error_500(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.UpdateCaseDetailsController = UpdateCaseDetailsController;
