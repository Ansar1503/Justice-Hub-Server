import { PaymentBaseDto } from "@src/application/dtos/Payments/PaymentsDto";
import { IFetchPaymentsUsecase } from "../IFetchPaymentsUsecase";
import { IPaymentsRepo } from "@domain/IRepository/IPaymentsRepo";

export class FetchPaymentsUsecase implements IFetchPaymentsUsecase {
  constructor(private _paymentsRepo: IPaymentsRepo) {}
  async execute(input: {
    page: number;
    limit: number;
    sortBy: "date" | "amount";
    order: "asc" | "desc";
    status: "pending" | "paid" | "failed" | "refunded" | "all";
    clientId: string;
    paidFor: "subscription" | "appointment" | "all";
  }): Promise<{
    data: PaymentBaseDto[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const payments = await this._paymentsRepo.findAll(input);
    return {
      data: payments.data.map((p) => ({
        amount: p.amount,
        createdAt: p.createdAt,
        id: p.id,
        paidFor: p.paidFor,
        referenceId: p.referenceId,
        status: p.status,
        clientId: p.clientId,
        currency: p.currency,
        provider: p.provider,
        providerRefId: p.providerRefId,
      })),
      totalCount: payments.totalCount,
      currentPage: payments.currentPage,
      totalPages: payments.totalPages,
    };
  }
}
