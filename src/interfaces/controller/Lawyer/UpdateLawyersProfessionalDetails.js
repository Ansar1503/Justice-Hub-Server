"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLawyersProfessionalDetails = void 0;
const LawyerProfessionalDetailsUpdateSchema_1 = require("@interfaces/middelwares/validator/zod/lawyer/LawyerProfessionalDetailsUpdateSchema");
class UpdateLawyersProfessionalDetails {
    _usecase;
    _errors;
    _success;
    constructor(_usecase, _errors, _success) {
        this._usecase = _usecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        const parsed = LawyerProfessionalDetailsUpdateSchema_1.ProfessionalDetailsSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._errors.error_400(err.message);
        }
        if (!userId) {
            return this._errors.error_400("user id not found");
        }
        try {
            const result = await this._usecase.execute({ ...parsed.data, userId });
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
exports.UpdateLawyersProfessionalDetails = UpdateLawyersProfessionalDetails;
