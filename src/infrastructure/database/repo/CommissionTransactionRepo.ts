import { CommissionTransaction } from "@domain/entities/CommissionTransaction";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import {
  CommissionTransactionModel,
  ICommissionTransactionModel,
} from "../model/CommissionTransactionModel";
import { ClientSession } from "mongoose";
import { BaseRepository } from "./base/BaseRepo";

export class CommissionTransactionRepo
  extends BaseRepository<CommissionTransaction, ICommissionTransactionModel>
  implements ICommissionTransactionRepo
{
  constructor(
    mapper: IMapper<CommissionTransaction, ICommissionTransactionModel>,
    session?: ClientSession
  ) {
    super(CommissionTransactionModel, mapper, session);
  }
  async findByBookingId(id: string): Promise<CommissionTransaction | null> {
    const data = await this.model.findOne({ bookingId: id });
    return data ? this.mapper.toDomain(data) : null;
  }
  async update(payload: {
    id: string;
    status: CommissionTransaction["status"];
  }): Promise<CommissionTransaction | null> {
    const updated = await this.model.findOneAndUpdate(
      { _id: payload.id },
      {
        status: payload.status,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return updated ? this.mapper.toDomain(updated) : null;
  }
  async findByUserId(userId: string): Promise<CommissionTransaction[] | []> {
    const data = await this.model.find({
      $or: [{ clientId: userId }, { lawyerId: userId }],
    });
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
}
