"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const SubscriptionModel_1 = require("../model/SubscriptionModel");
class SubscriptionRepository extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(SubscriptionModel_1.SubscriptionPlanModel, mapper, session);
    }
    async findAll() {
        const data = await this.model.find();
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async findById(id) {
        const data = await this.model.findOne({ _id: id });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async update(payload) {
        const updated = await this.model.findOneAndUpdate({ _id: payload.id }, payload, { new: true });
        if (!updated)
            return null;
        return this.mapper.toDomain(updated);
    }
    async updateActiveStatus(id, status) {
        const data = await this.model.findOneAndUpdate({ _id: id }, { $set: { isActive: status } }, { new: true });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async findFreeTier() {
        const data = await this.model.findOne({ isFree: true });
        return data ? this.mapper.toDomain(data) : null;
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
