import { Wallet } from "@domain/entities/Wallet";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { WalletMapper } from "@infrastructure/Mapper/Implementations/WalletMapper";
import { BaseRepository } from "./base/BaseRepo";
import { IWalletModel, WalletModel } from "../model/WalletModel";

export class WalletRepo
  extends BaseRepository<Wallet, IWalletModel>
  implements IWalletRepo
{
  constructor() {
    super(WalletModel, new WalletMapper());
  }
  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.model.findOne({ user_id: userId });
    return wallet ? this.mapper.toDomain(wallet) : null;
  }

  async updateBalance(userId: string, amount: number): Promise<Wallet | null> {
    const updatedWallet = await this.model.findOneAndUpdate(
      { user_id: userId },
      { balance: amount },
      { new: true }
    );
  return updatedWallet ? this.mapper.toDomain(updatedWallet) : null;
  }
}
