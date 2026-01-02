"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionTransactionRepo = void 0;
const CommissionTransactionModel_1 = require("../model/CommissionTransactionModel");
const BaseRepo_1 = require("./base/BaseRepo");
class CommissionTransactionRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(CommissionTransactionModel_1.CommissionTransactionModel, mapper, session);
    }
    async findByBookingId(id) {
        const data = await this.model.findOne({ bookingId: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async update(payload) {
        const updated = await this.model.findOneAndUpdate({ _id: payload.id }, {
            status: payload.status,
            updatedAt: new Date(),
        }, { new: true });
        return updated ? this.mapper.toDomain(updated) : null;
    }
    async findByUserId(userId) {
        const data = await this.model.find({
            $or: [{ clientId: userId }, { lawyerId: userId }],
        });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async getCommissionSummary(start, end) {
        const data = await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: "credited",
                },
            },
            {
                $group: {
                    _id: null,
                    totalCommission: { $sum: "$commissionAmount" },
                    totalLawyerShare: { $sum: "$lawyerAmount" },
                    totalCollected: { $sum: "$amountPaid" },
                },
            },
        ]);
        return (data[0] || {
            totalCommission: 0,
            totalLawyerShare: 0,
            totalCollected: 0,
        });
    }
    async getCommissionTrends(start, end) {
        const data = await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: "credited",
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$commissionAmount" },
                },
            },
            { $sort: { _id: 1 } },
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
    async getCommissionGrowth(start, end) {
        const duration = end.getTime() - start.getTime();
        const prevStart = new Date(start.getTime() - duration);
        const prevEnd = new Date(end.getTime() - duration);
        const current = await this.getCommissionSummary(start, end);
        const prev = await this.getCommissionSummary(prevStart, prevEnd);
        if (prev.totalCommission === 0) {
            return current.totalCommission === 0 ? 0 : 100;
        }
        const growth = ((current.totalCommission - prev.totalCommission) /
            prev.totalCommission) *
            100;
        return Number(growth.toFixed(2));
    }
    async getSalesReport(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const results = await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: "credited",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyer",
                },
            },
            {
                $unwind: {
                    path: "$lawyer",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "user_id",
                    as: "client",
                },
            },
            {
                $unwind: {
                    path: "$client",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    bookingId: 1,
                    clientId: 1,
                    lawyerId: 1,
                    baseFee: 1,
                    subscriptionDiscount: 1,
                    followupDiscount: 1,
                    amountPaid: 1,
                    commissionPercent: 1,
                    commissionAmount: 1,
                    lawyerAmount: 1,
                    type: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lawyerName: "$lawyer.name",
                    clientName: "$client.name",
                },
            },
            { $sort: { createdAt: 1 } },
        ]);
        return results ? results : [];
    }
}
exports.CommissionTransactionRepo = CommissionTransactionRepo;
