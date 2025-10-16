import { SubscriptionPlan } from "@domain/entities/SubscriptionEntity";
import { IMapper } from "../IMapper";
import { ISubscriptionPlanModel } from "@infrastructure/database/model/SubscriptionModel";

export class SubscriptionPlanMapper
  implements IMapper<SubscriptionPlan, ISubscriptionPlanModel>
{
  toDomain(persistence: ISubscriptionPlanModel): SubscriptionPlan {
    return new SubscriptionPlan({
      id: persistence._id,
      name: persistence.name,
      description: persistence.description,
      price: persistence.price,
      interval: persistence.interval,
      stripeProductId: persistence.stripeProductId,
      stripePriceId: persistence.stripePriceId,
      isFree: persistence.isFree,
      isActive: persistence.isActive,
      benefits: {
        bookingsPerMonth: persistence.benefits.bookingsPerMonth,
        followupBookingsPerCase: persistence.benefits.followupBookingsPerCase,
        chatAccess: persistence.benefits.chatAccess,
        discountPercent: persistence.benefits.discountPercent,
        documentUploadLimit: persistence.benefits.documentUploadLimit,
        expiryAlert: persistence.benefits.expiryAlert,
        autoRenew: persistence.benefits.autoRenew,
      },
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toDomainArray(
    persistenceArray: ISubscriptionPlanModel[]
  ): SubscriptionPlan[] {
    return persistenceArray.map((p) => this.toDomain(p));
  }

  toPersistence(entity: SubscriptionPlan): Partial<ISubscriptionPlanModel> {
    return {
      _id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      interval: entity.interval,
      stripeProductId: entity.stripeProductId,
      stripePriceId: entity.stripePriceId,
      isFree: entity.isFree,
      isActive: entity.isActive,
      benefits: {
        bookingsPerMonth: entity.benefits.bookingsPerMonth,
        followupBookingsPerCase: entity.benefits.followupBookingsPerCase,
        chatAccess: entity.benefits.chatAccess,
        discountPercent: entity.benefits.discountPercent,
        documentUploadLimit: entity.benefits.documentUploadLimit,
        expiryAlert: entity.benefits.expiryAlert,
        autoRenew: entity.benefits.autoRenew,
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
