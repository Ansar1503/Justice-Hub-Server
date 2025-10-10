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
  async getCommissionSummary(
    start: Date,
    end: Date
  ): Promise<{
    totalCommission: number;
    totalLawyerShare: number;
    totalCollected: number;
  }> {
    const data = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: "credited",
        },
      },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commissionAmount" },
          totalLawyerShare: { $sum: "$lawyerAmount" },
          totalCollected: { $sum: "$amountPaid" },
        },
      },
    ]);

    return (
      data[0] || {
        totalCommission: 0,
        totalLawyerShare: 0,
        totalCollected: 0,
      }
    );
  }

  async getCommissionTrends(
    start: Date,
    end: Date
  ): Promise<
    {
      date: string;
      revenue: number;
    }[]
  > {
    const data = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: "credited",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$commissionAmount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    return data;
  }
}
