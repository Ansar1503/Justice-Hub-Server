"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseMapper = void 0;
const Case_1 = require("@domain/entities/Case");
class CaseMapper {
    toDomain(persistence) {
        return Case_1.Case.fromPersistance({
            caseType: persistence.caseType,
            clientId: persistence.clientId,
            createdAt: persistence.createdAt,
            id: persistence._id,
            lawyerId: persistence.lawyerId,
            status: persistence.status,
            title: persistence.title,
            updatedAt: persistence.updatedAt,
            summary: persistence.summary,
            estimatedValue: persistence.estimatedValue,
            nextHearing: persistence.nextHearing,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            caseType: entity.caseType,
            clientId: entity.clientId,
            createdAt: entity.createdAt,
            lawyerId: entity.lawyerId,
            status: entity.status,
            title: entity.title,
            updatedAt: entity.updatedAt,
            summary: entity.summary,
            estimatedValue: entity.estimatedValue,
            nextHearing: entity.nextHearing,
        };
    }
}
exports.CaseMapper = CaseMapper;
