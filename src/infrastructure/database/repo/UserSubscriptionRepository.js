"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionRepository = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const UserSubscriptionModel_1 = require("../model/UserSubscriptionModel");
class UserSubscriptionRepository extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(UserSubscriptionModel_1.UserSubscriptionModel, mapper, session);
    }
    async findByUser(userId) {
        const data = await this.model.findOne({ userId });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async findByStripeCustomerId(customerId) {
        const data = await this.model.findOne({ stripeCustomerId: customerId });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async findByStripeSubscriptionId(subscriptionId) {
        const data = await this.model.findOne({
            stripeSubscriptionId: subscriptionId,
        });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async createOrUpdate(subscription) {
        const updated = await this.model.findOneAndUpdate({ userId: subscription.userId }, this.mapper.toPersistence(subscription), {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            session: this.session,
        });
        if (!updated)
            throw new Error("Failed to upsert UserSubscription");
        return this.mapper.toDomain(updated);
    }
    async getSubscriptionRevenueSummary(start, end) {
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
                    foreignField: "_id",
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
        return (data[0] || {
            totalSubscriptionRevenue: 0,
            newSubscriptions: 0,
        });
    }
    async getSubscriptionTrends(start, end) {
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
                    foreignField: "_id",
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
    async getSubscriptionGrowth(start, end) {
        const duration = end.getTime() - start.getTime();
        const prevStart = new Date(start.getTime() - duration);
        const prevEnd = new Date(end.getTime() - duration);
        const current = await this.getSubscriptionRevenueSummary(start, end);
        const prev = await this.getSubscriptionRevenueSummary(prevStart, prevEnd);
        if (prev.totalSubscriptionRevenue === 0) {
            return current.totalSubscriptionRevenue === 0 ? 0 : 100;
        }
        const growth = ((current.totalSubscriptionRevenue - prev.totalSubscriptionRevenue) /
            prev.totalSubscriptionRevenue) *
            100;
        return Number(growth.toFixed(2));
    }
    async countActiveSubscriptions() {
        return this.model.countDocuments({
            status: "active",
        });
    }
    async countExpiredSubscriptions() {
        return this.model.countDocuments({
            status: "expired",
        });
    }
    async countNewSubscriptions(start, end) {
        return this.model.countDocuments({
            startDate: { $gte: start, $lte: end },
        });
    }
}
exports.UserSubscriptionRepository = UserSubscriptionRepository;
