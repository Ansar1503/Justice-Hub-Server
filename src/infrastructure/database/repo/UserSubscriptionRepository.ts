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
  implements IUserSubscriptionRepo
{
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
}
