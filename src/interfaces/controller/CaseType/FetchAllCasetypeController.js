"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasetypeController = void 0;
const CasetypeQueryValidation_1 = require("@interfaces/middelwares/validator/zod/Casetype/CasetypeQueryValidation");
class FetchAllCasetypeController {
    _usecase;
    _errors;
    _success;
    constructor(_usecase, _errors, _success) {
        this._usecase = _usecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const parsed = CasetypeQueryValidation_1.CasetypeQueryValidationSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._usecase.execute({
                ...parsed.data,
                practiceAreaId: parsed.data.pid,
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
exports.FetchAllCasetypeController = FetchAllCasetypeController;
