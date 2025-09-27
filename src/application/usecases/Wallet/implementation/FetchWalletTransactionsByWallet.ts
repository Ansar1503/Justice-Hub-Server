import {
    getWalletTransactionsInputDto,
    getWalletTransactionsOutputDto,
} from "@src/application/dtos/wallet/WalletTransactionDto";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { IFetchWalletTransactionsByWallet } from "../IFetchWalletTransactionsByWallet";

export class FetchWalletTransactionsByWallet implements IFetchWalletTransactionsByWallet {
    constructor(
        private walletRepo: IWalletRepo,
        private transactionsRepo: IWalletTransactionsRepo,
    ) {}
    async execute(input: getWalletTransactionsInputDto): Promise<getWalletTransactionsOutputDto> {
        const wallet = await this.walletRepo.getWalletByUserId(input.userId);
        if (!wallet) throw new Error("Wallet not found");
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
