import { WalletDto } from "@src/application/dtos/wallet/WalletDto";
import { IFetchWalletByUser } from "../IFetchWalletByUser";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";

export class FetchWalletByUser implements IFetchWalletByUser {
  constructor(private walletRepo: IWalletRepo) {}
  async execute(input: string): Promise<WalletDto> {
    const wallet = await this.walletRepo.getWalletByUserId(input);
    if (!wallet) throw new Error("Wallet not found");
    return {
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      id: wallet.id,
      status: wallet.status,
      user_id: wallet.user_id,
    };
  }
}
