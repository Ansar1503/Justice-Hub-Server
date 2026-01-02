"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideSlotsRepository = void 0;
const OverrideSlotsMapper_1 = require("@infrastructure/Mapper/Implementations/OverrideSlotsMapper");
const OverrideSlotModel_1 = __importDefault(require("../model/OverrideSlotModel"));
class OverrideSlotsRepository {
    mapper;
    constructor(mapper = new OverrideSlotsMapper_1.OverrideSlotsMapper()) {
        this.mapper = mapper;
    }
    async addOverrideSlots(payload) {
        const mapped = this.mapper.toPersistence(payload);
        // console.log("mapped", mapped);
        const data = await OverrideSlotModel_1.default.findOneAndUpdate({ lawyer_id: payload.lawyerId }, { $push: { overrideDates: { $each: mapped.overrideDates } } }, { upsert: true, new: true });
        return this.mapper.toDomain(data);
    }
    async fetchOverrideSlots(lawyer_id) {
        // console.log("lalywer", lawyer_id);
        const data = await OverrideSlotModel_1.default.findOne({ lawyer_id });
        // console.log("data", data);
        return data ? this.mapper.toDomain(data) : null;
    }
    async removeOverrideSlots(lawyer_id, date) {
        const inputDate = new Date(date);
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);
        const data = await OverrideSlotModel_1.default.findOneAndUpdate({ lawyer_id: lawyer_id }, {
            $pull: {
                overrideDates: {
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            },
        }, { new: true });
        return data ? this.mapper.toDomain(data) : null;
    }
    async fetcghOverrideSlotByDate(lawyer_id, date) {
        const inputDate = new Date(date);
        const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
        const overrideSlots = await OverrideSlotModel_1.default.findOne({
            lawyer_id,
            overrideDates: {
                $elemMatch: {
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            },
        }, {
            "overrideDates.$": 1,
        });
        return overrideSlots ? this.mapper.toDomain(overrideSlots) : null;
    }
}
exports.OverrideSlotsRepository = OverrideSlotsRepository;
