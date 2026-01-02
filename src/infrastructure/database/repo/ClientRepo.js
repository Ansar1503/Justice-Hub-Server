"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const ClientMapper_1 = require("@infrastructure/Mapper/Implementations/ClientMapper");
const ClientModel_1 = __importDefault(require("../model/ClientModel"));
class ClientRepository {
    mapper;
    _session;
    constructor(mapper = new ClientMapper_1.ClientMapper(), _session) {
        this.mapper = mapper;
        this._session = _session;
    }
    async create(client) {
        const mapped = this.mapper.toPersistence(client);
        const data = await new ClientModel_1.default(mapped).save({ session: this._session });
        return this.mapper.toDomain(data);
    }
    async findByUserId(user_id) {
        return await ClientModel_1.default.findOne({ user_id });
    }
    async update(clientData) {
        return await ClientModel_1.default.findOneAndUpdate({ user_id: clientData.user_id }, {
            $set: {
                dob: clientData.dob,
                gender: clientData.gender,
                profile_image: clientData.profile_image,
                address: clientData.address,
            },
        });
    }
    async findAll() {
        const data = await ClientModel_1.default.find({}).populate("address");
        return data && this.mapper.toDomainArray ? this.mapper.toDomainArray(data) : [];
    }
}
exports.ClientRepository = ClientRepository;
