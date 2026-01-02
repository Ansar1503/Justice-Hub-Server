"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCommissionSettingsUsecase = void 0;
class FetchCommissionSettingsUsecase {
    _commissionSettings;
    constructor(_commissionSettings) {
        this._commissionSettings = _commissionSettings;
    }
    async execute(input) {
        const existingCommission = await this._commissionSettings.fetchCommissionSettings();
        if (!existingCommission)
            throw new Error("no commission settingsfound");
        return {
            createdAt: existingCommission.createdAt,
            followupCommission: existingCommission.followupCommission,
            id: existingCommission.id,
            initialCommission: existingCommission.initialCommission,
            updatedAt: existingCommission.updatedAt,
        };
    }
}
exports.FetchCommissionSettingsUsecase = FetchCommissionSettingsUsecase;
