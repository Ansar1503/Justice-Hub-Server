"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseDocumentsMapper = void 0;
const CaseDocument_1 = require("@domain/entities/CaseDocument");
class caseDocumentsMapper {
    toDomain(persistence) {
        return CaseDocument_1.CaseDocument.fromPersistence({
            caseId: persistence.caseId,
            createdAt: persistence.createdAt,
            document: persistence.document,
            id: persistence._id,
            updatedAt: persistence.updatedAt,
            uploadedBy: persistence.uploadBy,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            caseId: entity.caseId,
            document: entity.document,
            uploadBy: entity.uploadedBy,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.caseDocumentsMapper = caseDocumentsMapper;
