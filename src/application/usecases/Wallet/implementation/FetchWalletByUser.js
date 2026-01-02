"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletByUser = void 0;
class FetchWalletByUser {
    walletRepo;
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    async execute(input) {
        const wallet = await this.walletRepo.getWalletByUserId(input);
        if (!wallet)
            throw new Error("Wallet not found");
        return {
            balance: wallet.balance,
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt,
            id: wallet.id,
            status: wallet.status,
            isAdmin: wallet.isAdmin,
            user_id: wallet.user_id,
        };
    }
}
exports.FetchWalletByUser = FetchWalletByUser;
