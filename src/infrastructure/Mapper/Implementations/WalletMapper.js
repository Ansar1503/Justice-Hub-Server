"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
const Wallet_1 = require("@domain/entities/Wallet");
class WalletMapper {
    toDomain(persistence) {
        return Wallet_1.Wallet.fromPersisted({
            balance: persistence.balance,
            id: persistence._id,
            status: persistence.status,
            user_id: persistence.user_id,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            isAdmin: persistence.isAdmin,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            balance: entity.balance,
            status: entity.status,
            user_id: entity.user_id,
            isAdmin: entity.isAdmin,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.WalletMapper = WalletMapper;
