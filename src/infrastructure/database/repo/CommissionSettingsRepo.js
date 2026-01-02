"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSettingsRepo = void 0;
const CommissionSettingsModel_1 = require("../model/CommissionSettingsModel");
const BaseRepo_1 = require("./base/BaseRepo");
class CommissionSettingsRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper) {
        super(CommissionSettingsModel_1.CommissionSettingsModel, mapper);
    }
    async fetchCommissionSettings() {
        const data = await this.model.findOne();
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async update(payload) {
        const updated = await this.model.findOneAndUpdate({ _id: payload.id }, {
            initialCommission: payload.initialCommission,
            followupCommission: payload.followupCommission,
        }, { new: true });
        return updated ? this.mapper.toDomain(updated) : null;
    }
}
exports.CommissionSettingsRepo = CommissionSettingsRepo;
