"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrUpdateCommissionSettingsController = void 0;
const CreateCommissionInputSchema_1 = require("@interfaces/middelwares/validator/zod/Commission/CreateCommissionInputSchema");
class CreateOrUpdateCommissionSettingsController {
    _createOrUpdateCommissionSettings;
    _errors;
    _success;
    constructor(_createOrUpdateCommissionSettings, _errors, _success) {
        this._createOrUpdateCommissionSettings = _createOrUpdateCommissionSettings;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const parsed = await CreateCommissionInputSchema_1.CreateCommissionSettingsInputSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._errors.error_400(err.message);
        }
        try {
            const result = await this._createOrUpdateCommissionSettings.execute(parsed.data);
            return this._success.success_201(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.CreateOrUpdateCommissionSettingsController = CreateOrUpdateCommissionSettingsController;
