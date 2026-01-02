"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionMapper = void 0;
const UserSubscriptionPlan_1 = require("@domain/entities/UserSubscriptionPlan");
class UserSubscriptionMapper {
    toDomain(persistence) {
        return new UserSubscriptionPlan_1.UserSubscription({
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
                followupBookingsPerCase: persistence.benefitsSnapshot.followupBookingsPerCase,
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
    toDomainArray(persistenceArray) {
        return persistenceArray.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
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
                followupBookingsPerCase: entity.benefitsSnapshot.followupBookingsPerCase,
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
exports.UserSubscriptionMapper = UserSubscriptionMapper;
