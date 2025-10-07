import { CommissionTransaction } from "@domain/entities/CommissionTransaction";
import { ICommissionTransactionModel } from "@infrastructure/database/model/CommissionTransactionModel";
import { IMapper } from "../IMapper";

export class CommissionTransactionMapper
  implements IMapper<CommissionTransaction, ICommissionTransactionModel>
{
  toDomain(persistence: ICommissionTransactionModel): CommissionTransaction {
    return CommissionTransaction.fromPersistence({
      id: persistence._id,
      bookingId: persistence.bookingId,
      clientId: persistence.clientId,
      lawyerId: persistence.lawyerId,
      amountPaid: persistence.amountPaid,
      commissionPercent: persistence.commissionPercent,
      commissionAmount: persistence.commissionAmount,
      lawyerAmount: persistence.lawyerAmount,
      type: persistence.type,
      status: persistence.status,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toDomainArray(
    persistence: ICommissionTransactionModel[]
  ): CommissionTransaction[] {
    return persistence.map((p) => this.toDomain(p));
  }

  toPersistence(
    entity: CommissionTransaction
  ): Partial<ICommissionTransactionModel> {
    return {
      _id: entity.id,
      bookingId: entity.bookingId,
      clientId: entity.clientId,
      lawyerId: entity.lawyerId,
      amountPaid: entity.amountPaid,
      commissionPercent: entity.commissionPercent,
      commissionAmount: entity.commissionAmount,
      lawyerAmount: entity.lawyerAmount,
      type: entity.type,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
