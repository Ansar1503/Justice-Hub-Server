"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPracticeAreasBySpecIds = void 0;
class FindPracticeAreasBySpecIds {
    _FindPracticeAreaUsecase;
    _Errors;
    _Success;
    constructor(_FindPracticeAreaUsecase, _Errors, _Success) {
        this._FindPracticeAreaUsecase = _FindPracticeAreaUsecase;
        this._Errors = _Errors;
        this._Success = _Success;
    }
    async handle(httpRequest) {
        let specIds = [];
        if (httpRequest.query && typeof httpRequest.query === "object" && "specIds" in httpRequest.query) {
            if (Array.isArray(httpRequest.query.specIds)) {
                specIds = httpRequest.query.specIds;
            }
            else if (typeof httpRequest.query.specIds === "string") {
                specIds = [httpRequest.query.specIds];
            }
        }
        if (!specIds) {
            return this._Errors.error_400("no specids found");
        }
        try {
            const result = await this._FindPracticeAreaUsecase.execute({ specIds });
            return this._Success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._Errors.error_400(error.message);
            }
            return this._Errors.error_500();
        }
    }
}
exports.FindPracticeAreasBySpecIds = FindPracticeAreasBySpecIds;
