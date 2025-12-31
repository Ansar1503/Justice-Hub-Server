import { IPaymentsRepo } from "@domain/IRepository/IPaymentsRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Payment } from "@domain/entities/PaymentsEntity";
import { IPaymentModel, PaymentModel } from "../model/PaymentsModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

export class PaymentRepo
  extends BaseRepository<Payment, IPaymentModel>
  implements IPaymentsRepo
{
  constructor(
    mapper: IMapper<Payment, IPaymentModel>,
    session?: ClientSession
  ) {
    super(PaymentModel, mapper, session);
  }
  async findAll(payload: {
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
  }> {
    const { page, limit, sortBy, order, status, clientId, paidFor } = payload;

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const sort: { [key: string]: 1 | -1 } =
      sortBy === "amount" ? { amount: sortOrder } : { createdAt: sortOrder };

    const filter: any = { clientId };

    if (["pending", "paid", "failed", "refunded"].includes(status))
      filter.status = status;
    if (["subscription", "appointment"].includes(paidFor))
      filter.paidFor = paidFor;

    const [data, totalCount] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);

    const mappedData =
      this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: mappedData,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }
}
