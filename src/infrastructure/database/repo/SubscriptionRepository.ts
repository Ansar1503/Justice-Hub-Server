import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { BaseRepository } from "./base/BaseRepo";
import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import {
  ISubscriptionPlanModel,
  SubscriptionPlanModel,
} from "../model/SubscriptionModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";
import { SubscriptionBaseDto } from "@src/application/dtos/Subscription/SubscriptionDto";

export class SubscriptionRepository
  extends BaseRepository<SubscriptionPlan, ISubscriptionPlanModel>
  implements ISubscriptionRepo
{
  constructor(
    mapper: IMapper<SubscriptionPlan, ISubscriptionPlanModel>,
    session?: ClientSession
  ) {
    super(SubscriptionPlanModel, mapper, session);
  }

  async findAll(): Promise<SubscriptionPlan[] | []> {
    const data = await this.model.find();
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
  async findById(id: string): Promise<SubscriptionPlan | null> {
    const data = await this.model.findOne({ _id: id });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }
  async update(
    payload: Omit<SubscriptionBaseDto, "createdAt" | "updatedAt">
  ): Promise<SubscriptionPlan | null> {
    const updated = await this.model.findOneAndUpdate(
      { _id: payload.id },
      payload,
      { new: true }
    );
    if (!updated) return null;
    return this.mapper.toDomain(updated);
  }
  async updateActiveStatus(
    id: string,
    status: boolean
  ): Promise<SubscriptionPlan | null> {
    const data = await this.model.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: status } },
      { new: true }
    );
    if (!data) return null;
    return this.mapper.toDomain(data);
  }
  async findFreeTier(): Promise<SubscriptionPlan | null> {
    const data = await this.model.findOne({ isFree: true });
    return data ? this.mapper.toDomain(data) : null;
  }
}
