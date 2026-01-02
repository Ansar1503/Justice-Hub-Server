"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletTransactionsByWallet = void 0;
class FetchWalletTransactionsByWallet {
    walletRepo;
    transactionsRepo;
    constructor(walletRepo, transactionsRepo) {
        this.walletRepo = walletRepo;
        this.transactionsRepo = transactionsRepo;
    }
    async execute(input) {
        const wallet = await this.walletRepo.getWalletByUserId(input.userId);
        if (!wallet)
            throw new Error("Wallet not found");
        const transactions = await this.transactionsRepo.findTransactionsByWalletId({
            page: input.page,
            walletId: wallet.id,
            limit: input.limit,
            endDate: input.endDate,
            startDate: input.startDate,
            search: input.search,
            type: input.type,
        });
        return {
            page: transactions.page,
            totalPages: transactions.totalPages,
            data: transactions
                ? transactions.data.map((t) => ({
                    amount: t.amount,
                    category: t.category,
                    createdAt: t.createdAt,
                    description: t.description,
                    id: t.id,
                    walletId: t.walletId,
                    status: t.status,
                    type: t.type,
                    updatedAt: t.updatedAt,
                }))
                : [],
        };
    }
}
exports.FetchWalletTransactionsByWallet = FetchWalletTransactionsByWallet;
