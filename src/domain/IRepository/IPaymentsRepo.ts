import { Payment } from "@domain/entities/PaymentsEntity";
import { IBaseRepository } from "./IBaseRepo";

export interface IPaymentsRepo extends IBaseRepository<Payment> {
  findAll(payload: {
    page: number;
    limit: number;
    sortBy: "date" | "amount";
    order: "asc" | "desc";
    status: "pending" | "paid" | "failed" | "refunded" | "all";
    clientId: string;
  paidFor: "subscription" | "appointment" | "all";
  }): Promise<{
    data: Payment[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
}
