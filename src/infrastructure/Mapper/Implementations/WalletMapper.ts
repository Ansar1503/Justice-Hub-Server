import { Wallet } from "@domain/entities/Wallet";
import { IWalletModel } from "@infrastructure/database/model/WalletModel";
import { IMapper } from "../IMapper";

export class WalletMapper implements IMapper<Wallet, IWalletModel> {
    toDomain(persistence: IWalletModel): Wallet {
        return Wallet.fromPersisted({
            balance: persistence.balance,
            id: persistence._id,
            status: persistence.status,
            user_id: persistence.user_id,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            isAdmin: persistence.isAdmin,
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
            isAdmin: entity.isAdmin,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
