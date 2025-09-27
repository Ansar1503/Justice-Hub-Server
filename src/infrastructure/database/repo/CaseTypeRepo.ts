import { CaseType } from "@domain/entities/CaseType";
import { ICasetype } from "@domain/IRepository/ICasetype";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import {
    CasetypeFetchQueryDto,
    CaseTypeFetchResultDto,
    UpdateCasetypeInputDto,
} from "@src/application/dtos/CaseType/CaseTypeDto";
import { CasetypeModel, ICasetypeModel } from "../model/CaseTypeModel";
import { BaseRepository } from "./base/BaseRepo";

export class CaseTypeRepo extends BaseRepository<CaseType, ICasetypeModel> implements ICasetype {
    constructor(mapper: IMapper<CaseType, ICasetypeModel>) {
        super(CasetypeModel, mapper);
    }
    async findById(id: string): Promise<CaseType | null> {
        const data = await this.model.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findByName(name: string): Promise<CaseType | null> {
        const data = await this.model.findOne({ name });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAllByQuery(query: CasetypeFetchQueryDto): Promise<CaseTypeFetchResultDto> {
        const { limit, page, practiceAreaId, search } = query;
        const skip = (page - 1) * limit;
        const queries: Record<string, any> = {};
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

    async findAll(): Promise<CaseType[] | []> {
        const data = await this.model.find();
        return this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];
    }

    async update(payload: UpdateCasetypeInputDto): Promise<CaseType | null> {
        const data = await this.model.findOneAndUpdate(
            { _id: payload.id },
            { name: payload.name, practiceareaId: payload.practiceareaId },
            { new: true },
        );
        return data ? this.mapper.toDomain(data) : null;
    }
    async delete(id: string): Promise<CaseType | null> {
        const data = await this.model.findOneAndDelete({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findByPracticeAreas(query: string[]): Promise<CaseType[] | []> {
        const data = await this.model.find({ practiceareaId: { $in: query } });
        return this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [];
    }
}
