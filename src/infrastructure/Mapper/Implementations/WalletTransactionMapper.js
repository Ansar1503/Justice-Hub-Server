"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionMapper = void 0;
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
class WalletTransactionMapper {
    toDomain(persistence) {
        return new WalletTransactions_1.WalletTransaction({
            amount: persistence.amount,
            walletId: persistence.walletId,
            category: persistence.category,
            description: persistence.description,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            id: persistence._id,
            status: persistence.status,
            type: persistence.type,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            walletId: entity.walletId,
            amount: entity.amount,
            category: entity.category,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            status: entity.status,
            type: entity.type,
        };
    }
}
exports.WalletTransactionMapper = WalletTransactionMapper;
