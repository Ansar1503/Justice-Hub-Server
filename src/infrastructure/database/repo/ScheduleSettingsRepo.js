"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSettingsRepository = void 0;
const ScheduleSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/ScheduleSettingsMapper");
const ScheduleSettingsModel_1 = __importDefault(require("../model/ScheduleSettingsModel"));
class ScheduleSettingsRepository {
    mapper;
    constructor(mapper = new ScheduleSettingsMapper_1.ScheduleSettingsMapper()) {
        this.mapper = mapper;
    }
    async updateScheduleSettings(payload) {
        const update = await ScheduleSettingsModel_1.default.findOneAndUpdate({ lawyer_id: payload.lawyerId }, {
            $set: {
                slotDuration: payload.slotDuration,
                maxDaysInAdvance: payload.maxDaysInAdvance,
                autoConfirm: payload.autoConfirm,
            },
        }, { upsert: true, new: true });
        return this.mapper.toDomain(update);
    }
    async fetchScheduleSettings(lawyer_id) {
        const data = await ScheduleSettingsModel_1.default.findOne({ lawyer_id });
        return data ? this.mapper.toDomain(data) : null;
    }
}
exports.ScheduleSettingsRepository = ScheduleSettingsRepository;
