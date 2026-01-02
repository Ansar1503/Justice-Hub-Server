"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseTypesByPracticeAreasController = void 0;
class FindCaseTypesByPracticeAreasController {
    _findCaseTypes;
    _errors;
    _success;
    constructor(_findCaseTypes, _errors, _success) {
        this._findCaseTypes = _findCaseTypes;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let practiceIds = [];
        if (httpRequest.query && typeof httpRequest.query === "object" && "pids" in httpRequest.query) {
            if (Array.isArray(httpRequest.query.pids)) {
                practiceIds = httpRequest.query.pids;
            }
            else if (typeof httpRequest.query.pids === "string") {
                practiceIds = [httpRequest.query.pids];
            }
        }
        if (!practiceIds) {
            return this._errors.error_400("no practice areas found");
        }
        try {
            const res = await this._findCaseTypes.execute(practiceIds);
            return this._success.success_200(res);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FindCaseTypesByPracticeAreasController = FindCaseTypesByPracticeAreasController;
