import { Wallet } from "@domain/entities/Wallet";
import { IBaseRepository } from "./IBaseRepo";

export interface IWalletRepo extends IBaseRepository<Wallet> {
  getWalletByUserId(userId: string): Promise<Wallet | null>;
  getAdminWallet(): Promise<Wallet | null>;
  updateBalance(userId: string, amount: number): Promise<Wallet | null>;
}
