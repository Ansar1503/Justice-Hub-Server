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
  
}
