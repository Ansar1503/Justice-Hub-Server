"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerDocumentsRepository = void 0;
const LawyerDocumentMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerDocumentMapper");
const LawyerDocumentsModel_1 = __importDefault(require("../model/LawyerDocumentsModel"));
class LawyerDocumentsRepository {
    mapper;
    _session;
    constructor(mapper = new LawyerDocumentMapper_1.lawyerDocumentsMapper(), _session) {
        this.mapper = mapper;
        this._session = _session;
    }
    async create(documents) {
        const createdDocument = await LawyerDocumentsModel_1.default.findOneAndUpdate({ _id: documents.id, userId: documents.userId }, {
            barCouncilCertificate: documents.barCouncilCertificate,
            enrollmentCertificate: documents.enrollmentCertificate,
            certificateOfPractice: documents.certificateOfPractice,
        }, { upsert: true, new: true, session: this._session });
        return this.mapper.toDomain(createdDocument);
    }
    async find(user_id) {
        const data = await LawyerDocumentsModel_1.default.findOne({ userId: user_id }, {}, { session: this._session });
        return data ? this.mapper.toDomain(data) : null;
    }
}
exports.LawyerDocumentsRepository = LawyerDocumentsRepository;
