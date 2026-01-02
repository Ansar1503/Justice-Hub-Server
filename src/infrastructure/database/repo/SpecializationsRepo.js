"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationRepo = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const SpecializationModel_1 = require("../model/SpecializationModel");
class SpecializationRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper) {
        super(SpecializationModel_1.SpecializationModel, mapper);
    }
    async findAll(payload) {
        const { limit, page, search } = payload;
        const skip = (page - 1) * limit;
        const query = {};
        if (search.trim()) {
            query["name"] = { $regex: search, $options: "i" };
        }
        const [specializations, count] = await Promise.all([
            await this.model.find(query).skip(skip).limit(limit),
            await this.model.countDocuments(),
        ]);
        const totalPage = Math.ceil(count / limit);
        return {
            data: this.mapper.toDomainArray && specializations ? this.mapper.toDomainArray(specializations) : [],
            currentPage: page,
            totalCount: count,
            totalPage,
        };
    }
    async findById(id) {
        const data = await this.model.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async updateName(id, name) {
        const updated = await this.model.findByIdAndUpdate({
            _id: id,
        }, { name }, { new: true });
        if (!updated) {
            throw new Error("update failed");
        }
        return this.mapper.toDomain(updated);
    }
    async findByName(name) {
        const data = await this.model.findOne({ name });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async delete(id) {
        const deleted = await this.model.findOneAndDelete({ _id: id });
        if (!deleted)
            return null;
        return this.mapper.toDomain(deleted);
    }
}
exports.SpecializationRepo = SpecializationRepo;
