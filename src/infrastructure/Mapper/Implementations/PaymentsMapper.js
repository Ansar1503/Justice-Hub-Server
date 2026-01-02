"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMapper = void 0;
const PaymentsEntity_1 = require("@domain/entities/PaymentsEntity");
class PaymentMapper {
    toDomain(persistence) {
        return PaymentsEntity_1.Payment.fromPersistence({
            id: persistence._id,
            clientId: persistence.clientId,
            paidFor: persistence.paidFor,
            referenceId: persistence.referenceId,
            amount: persistence.amount,
            currency: persistence.currency,
            status: persistence.status,
            provider: persistence.provider,
            providerRefId: persistence.providerRefId,
            createdAt: persistence.createdAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            clientId: entity.clientId,
            paidFor: entity.paidFor,
            referenceId: entity.referenceId,
            amount: entity.amount,
            currency: entity.currency,
            status: entity.status,
            provider: entity.provider,
            providerRefId: entity.providerRefId,
            createdAt: entity.createdAt,
        };
    }
}
exports.PaymentMapper = PaymentMapper;
