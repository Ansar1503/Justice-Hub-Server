import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { BaseRepository } from "./base/BaseRepo";
import {
  IUserSubscriptionModel,
  UserSubscriptionModel,
} from "../model/UserSubscriptionModel";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

export class UserSubscriptionRepository
  extends BaseRepository<UserSubscription, IUserSubscriptionModel>
  implements IUserSubscriptionRepo {
  constructor(
    mapper: IMapper<UserSubscription, IUserSubscriptionModel>,
    session?: ClientSession
  ) {
    super(UserSubscriptionModel, mapper, session);
  }
  async findByUser(userId: string): Promise<UserSubscription | null> {
    const data = await this.model.findOne({ userId });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }
  async findByStripeCustomerId(
    customerId: string
  ): Promise<UserSubscription | null> {
    const data = await this.model.findOne({ stripeCustomerId: customerId });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async findByStripeSubscriptionId(
    subscriptionId: string
  ): Promise<UserSubscription | null> {
    const data = await this.model.findOne({
      stripeSubscriptionId: subscriptionId,
    });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }

  async createOrUpdate(
    subscription: UserSubscription
  ): Promise<UserSubscription | null> {
    const updated = await this.model.findOneAndUpdate(
      { userId: subscription.userId },
      this.mapper.toPersistence(subscription),
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session: this.session,
      }
    );

    if (!updated) throw new Error("Failed to upsert UserSubscription");
    return this.mapper.toDomain(updated);
  }
  async getSubscriptionRevenueSummary(
    start: Date,
    end: Date
  ): Promise<{ totalSubscriptionRevenue: number; newSubscriptions: number }> {
    const data = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ["active", "trialing", "expired"] },
        },
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "planId",
          foreignField: "id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
      {
        $group: {
          _id: null,
          totalSubscriptionRevenue: {
            $sum: "$plan.price",
          },
          newSubscriptions: { $sum: 1 },
        },
      },
    ]);

    return (
      data[0] || {
        totalSubscriptionRevenue: 0,
        newSubscriptions: 0,
      }
    );
  }
  async getSubscriptionTrends(
    start: Date,
    end: Date
  ): Promise<{ date: string; revenue: number }[]> {
    const data = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ["active", "trialing", "expired"] },
        },
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "planId",
          foreignField: "id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$plan.price" },
        },
      },
      { $sort: { "_id": 1 } },
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
  async getSubscriptionGrowth(start: Date, end: Date): Promise<number> {
    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration);
    const prevEnd = new Date(end.getTime() - duration);

    const current = await this.getSubscriptionRevenueSummary(start, end);
    const prev = await this.getSubscriptionRevenueSummary(prevStart, prevEnd);

    if (prev.totalSubscriptionRevenue === 0) {
      return current.totalSubscriptionRevenue === 0 ? 0 : 100;
    }

    const growth =
      ((current.totalSubscriptionRevenue - prev.totalSubscriptionRevenue) /
        prev.totalSubscriptionRevenue) *
      100;

    return Number(growth.toFixed(2));
  }
  async countActiveSubscriptions(): Promise<number> {
    return this.model.countDocuments({
      status: "active",
    });
  }

  async countExpiredSubscriptions(): Promise<number> {
    return this.model.countDocuments({
      status: "expired",
    });
  }

  async countNewSubscriptions(start: Date, end: Date): Promise<number> {
    return this.model.countDocuments({
      startDate: { $gte: start, $lte: end },
    });
  }

}
