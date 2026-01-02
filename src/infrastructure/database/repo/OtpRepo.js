"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const OtpMapper_1 = require("@infrastructure/Mapper/Implementations/OtpMapper");
const OtpModel_1 = __importDefault(require("../model/OtpModel"));
class OtpRepository {
    mapper;
    _session;
    constructor(mapper = new OtpMapper_1.OtpMapper(), _session) {
        this.mapper = mapper;
        this._session = _session;
    }
    async storeOtp(otp) {
        await OtpModel_1.default.findOneAndUpdate({ email: otp.email }, { otp: otp.otp, expiresAt: otp.expiresAt }, { upsert: true, new: true, session: this._session });
    }
    async findOtp(email) {
        const data = await OtpModel_1.default.findOne({ email });
        return data ? this.mapper.toDomain(data) : null;
    }
    async delete(email) {
        await OtpModel_1.default.deleteOne({ email });
    }
}
exports.OtpRepository = OtpRepository;
