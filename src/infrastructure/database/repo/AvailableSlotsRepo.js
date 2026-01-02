"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotRepository = void 0;
const AvailableSlotsMapper_1 = require("@infrastructure/Mapper/Implementations/AvailableSlotsMapper");
const AvailabilityModel_1 = __importDefault(require("../model/AvailabilityModel"));
class AvailableSlotRepository {
    mapper;
    constructor(mapper = new AvailableSlotsMapper_1.AvailableSlotsMapper()) {
        this.mapper = mapper;
    }
    async findAvailableSlots(lawyer_id) {
        const data = await AvailabilityModel_1.default.findOne({ lawyer_id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async updateAvailbleSlot(payload) {
        const newpayload = this.mapper.toPersistence(payload);
        const { _id, ...updateData } = newpayload;
        const data = await AvailabilityModel_1.default.findOneAndUpdate({
            lawyer_id: payload.lawyer_id,
        }, { $set: updateData }, { upsert: true, new: true });
        return data ? this.mapper.toDomain(data) : null;
    }
}
exports.AvailableSlotRepository = AvailableSlotRepository;
