"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerVerificationRepo = void 0;
const LawyerVerificaitionModel_1 = __importDefault(require("../model/LawyerVerificaitionModel"));
const BaseRepo_1 = require("./base/BaseRepo");
class LawyerVerificationRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(LawyerVerificaitionModel_1.default, mapper, session);
    }
    async findByUserId(id) {
        const data = await this.model
            .findOne({ userId: id }, {}, { session: this.session })
            .populate("documents");
        if (!data)
            return null;
        return {
            barCouncilNumber: data.barCouncilNumber,
            certificateOfPracticeNumber: data.certificateOfPracticeNumber,
            createdAt: data.createdAt,
            documents: {
                barCouncilCertificate: data.documents?.barCouncilCertificate,
                certificateOfPractice: data?.documents?.certificateOfPractice,
                enrollmentCertificate: data?.documents?.enrollmentCertificate,
                id: data?.documents?._id,
                userId: data?.documents?.userId,
            },
            enrollmentCertificateNumber: data.enrollmentCertificateNumber,
            id: data._id,
            updatedAt: data.updatedAt,
            userId: data?.userId,
            verificationStatus: data.verificationStatus,
            rejectReason: data.rejectReason,
        };
    }
    async update(payload) {
        const update = {};
        if (payload.barCouncilNumber?.trim()) {
            update["barCouncilNumber"] = payload.barCouncilNumber;
        }
        if (payload.certificateOfPracticeNumber?.trim()) {
            update["certificateOfPracticeNumber"] = payload.certificateOfPracticeNumber;
        }
        if (payload.enrollmentCertificateNumber?.trim()) {
            update["enrollmentCertificateNumber"] = payload.enrollmentCertificateNumber;
        }
        if (payload.documents?.trim()) {
            update["documents"] = payload.documents;
        }
        if (payload.verificationStatus) {
            update["verificationStatus"] = payload.verificationStatus;
        }
        if (payload.rejectReason !== undefined) {
            update["rejectReason"] = payload.rejectReason;
        }
        update["updatedAt"] = new Date();
        const updated = await this.model.findByIdAndUpdate(payload.id, update, {
            new: true,
            session: this.session,
        });
        if (!updated) {
            return null;
        }
        return this.mapper.toDomain(updated);
    }
}
exports.LawyerVerificationRepo = LawyerVerificationRepo;
