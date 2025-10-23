import { UserSubscriptionDto } from "@src/application/dtos/Subscription/SubscriptionDto";
import { IFetchCurrentUserSubscriptionUsecase } from "../IFetchCurrentUseSubscription";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";

export class FetchCurrentUserSubscriptionUsecase
  implements IFetchCurrentUserSubscriptionUsecase
{
  constructor(private _userSubscriptionRepo: IUserSubscriptionRepo) {}
  async execute(input: string): Promise<UserSubscriptionDto | null> {
    const userSub = await this._userSubscriptionRepo.findByUser(input);
    if (!userSub) return null;
    return {
      id: userSub.id,
      userId: userSub.userId,
      planId: userSub.planId,
      stripeSubscriptionId: userSub.stripeSubscriptionId,
      stripeCustomerId: userSub.stripeCustomerId,
      status: userSub.status,
      startDate: userSub.startDate,
      endDate: userSub.endDate,
      autoRenew: userSub.autoRenew,
      benefitsSnapshot: userSub.benefitsSnapshot,
      createdAt: userSub.createdAt,
      updatedAt: userSub.updatedAt,
    };
  }
}
