import { Payment } from "@domain/entities/PaymentsEntity";
import { IMapper } from "../IMapper";
import { IPaymentModel } from "@infrastructure/database/model/PaymentsModel";

export class PaymentMapper implements IMapper<Payment, IPaymentModel> {
  toDomain(persistence: IPaymentModel): Payment {
    return Payment.fromPersistence({
      id: persistence._id,
      clientId: persistence.clientId,
      paidFor: persistence.paidFor,
      referenceId: persistence.referenceId,
      amount: persistence.amount,
      currency: persistence.currency,
      status: persistence.status,
      provider: persistence.provider,
      providerRefId: persistence.providerRefId,
      createdAt: persistence.createdAt,
    });
  }

  toDomainArray(persistence: IPaymentModel[]): Payment[] {
    return persistence.map((p) => this.toDomain(p));
  }

  toPersistence(entity: Payment): Partial<IPaymentModel> {
    return {
      _id: entity.id,
      clientId: entity.clientId,
      paidFor: entity.paidFor,
      referenceId: entity.referenceId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      provider: entity.provider,
      providerRefId: entity.providerRefId,
      createdAt: entity.createdAt,
    };
  }
}
