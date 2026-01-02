"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeAreaRepo = void 0;
const PracticeAreaModel_1 = require("../model/PracticeAreaModel");
const BaseRepo_1 = require("./base/BaseRepo");
class PracticeAreaRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper) {
        super(PracticeAreaModel_1.practiceareaModel, mapper);
    }
    async findById(id) {
        const data = await this.model.findOne({ _id: id });
        if (!data)
            return null;
        return this.mapper.toDomain(data);
    }
    async findByName(name) {
        const data = await this.model.findOne({ name: name });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAll(payload) {
        const skip = (payload.page - 1) * payload.limit;
        const query = {};
        if (payload.search.trim()) {
            query["name"] = { $regex: payload.search, $options: "i" };
        }
        if (payload.specId?.trim()) {
            query["specializationId"] = payload.specId;
        }
        const [data, count] = await Promise.all([
            await this.model.find(query).skip(skip).limit(payload.limit),
            await this.model.countDocuments(query),
        ]);
        const totalPage = Math.ceil(count / payload.limit);
        return {
            currentPage: payload.page,
            totalCount: count,
            totalPage: totalPage,
            data: data.map((d) => ({
                createdAt: d.createdAt,
                id: d._id,
                name: d.name,
                specializationId: d.specializationId,
                updatedAt: d.updatedAt,
            })),
        };
    }
    async update(id, name, specId) {
        const updated = await this.model.findOneAndUpdate({ _id: id }, { name, specializationId: specId }, { new: true });
        return updated ? this.mapper.toDomain(updated) : null;
    }
    async delete(id) {
        const deleted = await this.model.findOneAndDelete({ _id: id });
        return deleted ? this.mapper.toDomain(deleted) : null;
    }
    async deleteBySpec(specId) {
        await this.model.deleteMany({ specializationId: specId });
    }
    async findBySpecIds(specIds) {
        const data = await this.model.find({ specializationId: { $in: specIds } });
        return data && this.mapper.toDomainArray ? this.mapper.toDomainArray(data) : [];
    }
}
exports.PracticeAreaRepo = PracticeAreaRepo;
