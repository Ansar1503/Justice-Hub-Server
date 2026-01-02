"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const AddressMapper_1 = require("@infrastructure/Mapper/Implementations/AddressMapper");
const AddressModel_1 = __importDefault(require("../model/AddressModel"));
class AddressRepository {
    mapper;
    constructor(mapper = new AddressMapper_1.AddressMapper()) {
        this.mapper = mapper;
    }
    async update(payload) {
        const data = await AddressModel_1.default.findOneAndUpdate({ user_id: payload.user_id }, {
            $set: {
                city: payload.city,
                locality: payload.locality,
                pincode: payload.pincode,
                state: payload.state,
            },
        }, { upsert: true, new: true });
        return this.mapper.toDomain(data);
    }
    async find(user_id) {
        const data = await AddressModel_1.default.findOne({ user_id: user_id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAll() {
        const data = await AddressModel_1.default.find({});
        return data && this.mapper.toDomainArray ? this.mapper.toDomainArray(data) : [];
    }
}
exports.AddressRepository = AddressRepository;
