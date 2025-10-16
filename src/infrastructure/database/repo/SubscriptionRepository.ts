import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { BaseRepository } from "./base/BaseRepo";
import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import {
  ISubscriptionPlanModel,
  SubscriptionPlanModel,
} from "../model/SubscriptionModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

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
}
