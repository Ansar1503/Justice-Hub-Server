import { PaymentBaseDto } from "@src/application/dtos/Payments/PaymentsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchPaymentsUsecase
  extends IUseCase<
    {
      page: number;
      limit: number;
      sortBy: "date" | "amount";
      order: "asc" | "desc";
      status: "pending" | "paid" | "failed" | "refunded" | "all";
      clientId: string;
      paidFor: "subscription" | "appointment" | "all";
    },
    {
      data: PaymentBaseDto[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    }
  > {}
