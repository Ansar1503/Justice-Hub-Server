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
      data: payments.data,
      totalCount: payments.totalCount,
      currentPage: payments.currentPage,
      totalPages: payments.totalPages,
    };
  }
}
