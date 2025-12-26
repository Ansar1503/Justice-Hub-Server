import { WalletDto } from "@src/application/dtos/wallet/WalletDto";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IFetchWalletByUser } from "../IFetchWalletByUser";

export class FetchWalletByUser implements IFetchWalletByUser {
    constructor(private _walletRepo: IWalletRepo) {}
    async execute(input: string): Promise<WalletDto> {
        const wallet = await this._walletRepo.getWalletByUserId(input);
        if (!wallet) throw new Error("Wallet not found");
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
