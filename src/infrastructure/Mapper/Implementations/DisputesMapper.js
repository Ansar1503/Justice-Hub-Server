"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesMapper = void 0;
const Disputes_1 = require("@domain/entities/Disputes");
class DisputesMapper {
    toDomain(persistence) {
        return Disputes_1.Disputes.fromPersistence({
            id: persistence._id,
            contentId: persistence.contentId.toString(),
            disputeType: persistence.disputeType,
            reason: persistence.reason,
            reportedBy: persistence.reportedBy,
            reportedUser: persistence.reportedUser,
            status: persistence.status,
            resolveAction: persistence.resolveAction,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            disputeType: entity.disputeType,
            contentId: entity.contentId,
            reason: entity.reason,
            reportedBy: entity.reportedBy,
            reportedUser: entity.reportedUser,
            resolveAction: entity.resolveAction,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.DisputesMapper = DisputesMapper;
