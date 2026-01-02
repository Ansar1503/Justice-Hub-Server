"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanMapper = void 0;
const SubscriptionEntity_1 = require("@domain/entities/SubscriptionEntity");
class SubscriptionPlanMapper {
    toDomain(persistence) {
        return new SubscriptionEntity_1.SubscriptionPlan({
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
    toDomainArray(persistenceArray) {
        return persistenceArray.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
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
exports.SubscriptionPlanMapper = SubscriptionPlanMapper;
