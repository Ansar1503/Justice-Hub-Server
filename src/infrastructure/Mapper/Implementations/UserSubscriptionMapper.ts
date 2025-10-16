import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";
import { IMapper } from "../IMapper";
import { IUserSubscriptionModel } from "@infrastructure/database/model/UserSubscriptionModel";

export class UserSubscriptionMapper
  implements IMapper<UserSubscription, IUserSubscriptionModel>
{
  toDomain(persistence: IUserSubscriptionModel): UserSubscription {
    return new UserSubscription({
      id: persistence._id,
      userId: persistence.userId,
      planId: persistence.planId,
      stripeSubscriptionId: persistence.stripeSubscriptionId,
      stripeCustomerId: persistence.stripeCustomerId,
      status: persistence.status,
      startDate: persistence.startDate,
      endDate: persistence.endDate,
      autoRenew: persistence.autoRenew,
      benefitsSnapshot: {
        bookingsPerMonth: persistence.benefitsSnapshot.bookingsPerMonth,
        followupBookingsPerCase:
          persistence.benefitsSnapshot.followupBookingsPerCase,
        chatAccess: persistence.benefitsSnapshot.chatAccess,
        discountPercent: persistence.benefitsSnapshot.discountPercent,
        documentUploadLimit: persistence.benefitsSnapshot.documentUploadLimit,
        expiryAlert: persistence.benefitsSnapshot.expiryAlert,
        autoRenew: persistence.benefitsSnapshot.autoRenew,
      },
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toDomainArray(
    persistenceArray: IUserSubscriptionModel[]
  ): UserSubscription[] {
    return persistenceArray.map((p) => this.toDomain(p));
  }

  toPersistence(entity: UserSubscription): Partial<IUserSubscriptionModel> {
    return {
      _id: entity.id,
      userId: entity.userId,
      planId: entity.planId,
      stripeSubscriptionId: entity.stripeSubscriptionId,
      stripeCustomerId: entity.stripeCustomerId,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      autoRenew: entity.autoRenew,
      benefitsSnapshot: {
        bookingsPerMonth: entity.benefitsSnapshot.bookingsPerMonth,
        followupBookingsPerCase:
          entity.benefitsSnapshot.followupBookingsPerCase,
        chatAccess: entity.benefitsSnapshot.chatAccess,
        discountPercent: entity.benefitsSnapshot.discountPercent,
        documentUploadLimit: entity.benefitsSnapshot.documentUploadLimit,
        expiryAlert: entity.benefitsSnapshot.expiryAlert,
        autoRenew: entity.benefitsSnapshot.autoRenew,
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
