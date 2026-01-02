"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepo = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const PaymentsModel_1 = require("../model/PaymentsModel");
class PaymentRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(PaymentsModel_1.PaymentModel, mapper, session);
    }
    async findAll(payload) {
        const { page, limit, sortBy, order, status, clientId, paidFor } = payload;
        const skip = (page - 1) * limit;
        const sortOrder = order === "asc" ? 1 : -1;
        const sort = sortBy === "amount" ? { amount: sortOrder } : { createdAt: sortOrder };
        const filter = { clientId };
        if (["pending", "paid", "failed", "refunded"].includes(status))
            filter.status = status;
        if (["subscription", "appointment"].includes(paidFor))
            filter.paidFor = paidFor;
        const [data, totalCount] = await Promise.all([
            this.model.find(filter).sort(sort).skip(skip).limit(limit),
            this.model.countDocuments(filter),
        ]);
        const mappedData = this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];
        const totalPages = Math.ceil(totalCount / limit);
        return {
            data: mappedData,
            totalCount,
            currentPage: page,
            totalPages,
        };
    }
}
exports.PaymentRepo = PaymentRepo;
