"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionTransactionMapper = void 0;
const CommissionTransaction_1 = require("@domain/entities/CommissionTransaction");
class CommissionTransactionMapper {
    toDomain(persistence) {
        return CommissionTransaction_1.CommissionTransaction.fromPersistence({
            id: persistence._id,
            bookingId: persistence.bookingId,
            clientId: persistence.clientId,
            lawyerId: persistence.lawyerId,
            amountPaid: persistence.amountPaid,
            commissionPercent: persistence.commissionPercent,
            commissionAmount: persistence.commissionAmount,
            lawyerAmount: persistence.lawyerAmount,
            type: persistence.type,
            status: persistence.status,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            baseFee: persistence.baseFee,
            subscriptionDiscount: persistence.subscriptionDiscount,
            followupDiscount: persistence.followupDiscount
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            bookingId: entity.bookingId,
            clientId: entity.clientId,
            lawyerId: entity.lawyerId,
            amountPaid: entity.amountPaid,
            commissionPercent: entity.commissionPercent,
            commissionAmount: entity.commissionAmount,
            lawyerAmount: entity.lawyerAmount,
            type: entity.type,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            baseFee: entity.baseFee,
            subscriptionDiscount: entity.subscriptionDiscount,
            followupDiscount: entity.followupDiscount
        };
    }
}
exports.CommissionTransactionMapper = CommissionTransactionMapper;
