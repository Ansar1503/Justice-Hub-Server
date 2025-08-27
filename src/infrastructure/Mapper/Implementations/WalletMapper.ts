import { Wallet } from "@domain/entities/Wallet";
import { IMapper } from "../IMapper";
import { IWalletModel } from "@infrastructure/database/model/WalletModel";

export class WalleMapper implements IMapper<Wallet, IWalletModel> {
  toDomain(persistence: IWalletModel): Wallet {
    return Wallet.fromPersisted({
      balance: persistence.balance,
      id: persistence._id,
      status: persistence.status,
      user_id: persistence.user_id,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toDomainArray(persistence: IWalletModel[]): Wallet[] {
    return persistence.map((p) => this.toDomain(p));
  }

  toPersistence(entity: Wallet): Partial<IWalletModel> {
    return {
      _id: entity.id,
      balance: entity.balance,
      status: entity.status,
      user_id: entity.user_id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
