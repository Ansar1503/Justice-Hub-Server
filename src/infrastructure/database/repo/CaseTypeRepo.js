"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTypeRepo = void 0;
const CaseTypeModel_1 = require("../model/CaseTypeModel");
const BaseRepo_1 = require("./base/BaseRepo");
class CaseTypeRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper) {
        super(CaseTypeModel_1.CasetypeModel, mapper);
    }
    async findById(id) {
        const data = await this.model.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findByName(name) {
        const data = await this.model.findOne({ name });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAllByQuery(query) {
        const { limit, page, practiceAreaId, search } = query;
        const skip = (page - 1) * limit;
        const queries = {};
        if (search.trim()) {
            queries["name"] = { $regex: search, $options: "i" };
        }
        if (practiceAreaId.trim()) {
            queries["practiceareaId"] = practiceAreaId;
        }
        const [data, count] = await Promise.all([
            await this.model.find(queries).skip(skip).limit(limit),
            await this.model.countDocuments(queries),
        ]);
        const totalPages = Math.ceil(count / limit);
        return {
            currentPage: page,
            totalCount: count,
            totalPage: totalPages,
            data: data
                ? data.map((c) => ({
                    createdAt: c.createdAt,
                    id: c._id,
                    name: c.name,
                    practiceareaId: c.practiceareaId,
                    updatedAt: c.updatedAt,
                }))
                : [],
        };
    }
    async findAll() {
        const data = await this.model.find();
        return this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];
    }
    async update(payload) {
        const data = await this.model.findOneAndUpdate({ _id: payload.id }, { name: payload.name, practiceareaId: payload.practiceareaId }, { new: true });
        return data ? this.mapper.toDomain(data) : null;
    }
    async delete(id) {
        const data = await this.model.findOneAndDelete({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findByPracticeAreas(query) {
        const data = await this.model.find({ practiceareaId: { $in: query } });
        return this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];
    }
}
exports.CaseTypeRepo = CaseTypeRepo;
