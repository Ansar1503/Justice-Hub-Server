"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrUpdateCommissionSettingsUseCase = void 0;
const CommissionSettings_1 = require("@domain/entities/CommissionSettings");
class CreateOrUpdateCommissionSettingsUseCase {
    _CommisssionSettingsRepo;
    constructor(_CommisssionSettingsRepo) {
        this._CommisssionSettingsRepo = _CommisssionSettingsRepo;
    }
    async execute(input) {
        if (!input.id) {
            const newCommissionSettingsPayload = CommissionSettings_1.CommissionSettings.create({
                followupCommission: input.followupCommission,
                initialCommission: input.initialCommission,
            });
            const newCommissionSettings = await this._CommisssionSettingsRepo.create(newCommissionSettingsPayload);
            return {
                createdAt: newCommissionSettings.createdAt,
                followupCommission: newCommissionSettings.followupCommission,
                id: newCommissionSettings.id,
                initialCommission: newCommissionSettings.initialCommission,
                updatedAt: newCommissionSettings.updatedAt,
            };
        }
        const existingCommission = await this._CommisssionSettingsRepo.fetchCommissionSettings();
        if (!existingCommission) {
            throw new Error("Commission does not exist");
        }
        const updatedCommissionSettings = await this._CommisssionSettingsRepo.update({
            followupCommission: input.followupCommission,
            id: input.id,
            initialCommission: input.initialCommission,
        });
        if (!updatedCommissionSettings)
            throw new Error("commission settings update failed");
        return {
            createdAt: updatedCommissionSettings.createdAt,
            followupCommission: updatedCommissionSettings.followupCommission,
            id: updatedCommissionSettings.id,
            initialCommission: updatedCommissionSettings.initialCommission,
            updatedAt: updatedCommissionSettings.updatedAt,
        };
    }
}
exports.CreateOrUpdateCommissionSettingsUseCase = CreateOrUpdateCommissionSettingsUseCase;
