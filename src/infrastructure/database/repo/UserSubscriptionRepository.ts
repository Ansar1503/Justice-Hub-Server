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
}
