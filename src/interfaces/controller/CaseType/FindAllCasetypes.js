"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCaseTypes = void 0;
class FindAllCaseTypes {
    _findCaseTypes;
    _errors;
    _success;
    constructor(_findCaseTypes, _errors, _success) {
        this._findCaseTypes = _findCaseTypes;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const res = await this._findCaseTypes.execute(undefined);
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
exports.FindAllCaseTypes = FindAllCaseTypes;
