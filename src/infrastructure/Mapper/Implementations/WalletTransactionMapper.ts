import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { IMapper } from "../IMapper";
import { IWalletTransactionModel } from "@infrastructure/database/model/WalletTransactionModelt";

export class WalletTransactionMapper
implements IMapper<WalletTransaction, IWalletTransactionModel>
{
    toDomain(persistence: IWalletTransactionModel): WalletTransaction {
        return new WalletTransaction({
            amount: persistence.amount,
            walletId: persistence.walletId,
            category: persistence.category,
            description: persistence.description,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            id: persistence._id,
            status: persistence.status,
            type: persistence.type,
        });
    }
    toDomainArray(persistence: IWalletTransactionModel[]): WalletTransaction[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: WalletTransaction): Partial<IWalletTransactionModel> {
        return {
            _id: entity.id,
            walletId: entity.walletId,
            amount: entity.amount,
            category: entity.category,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            status: entity.status,
            type: entity.type,
        };
    }
}
