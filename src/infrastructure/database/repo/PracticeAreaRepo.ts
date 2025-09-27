import { PracticeArea } from "@domain/entities/PracticeArea";
import { BaseRepository } from "./base/BaseRepo";
import {
    IPracticeareaModel,
    practiceareaModel,
} from "../model/PracticeAreaModel";
import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import {
    FindAllPracticeAreaInputDto,
    FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";

export class PracticeAreaRepo
    extends BaseRepository<PracticeArea, IPracticeareaModel>
    implements IPracticAreaRepo
{
    constructor(mapper: IMapper<PracticeArea, IPracticeareaModel>) {
        super(practiceareaModel, mapper);
    }
    async findById(id: string): Promise<PracticeArea | null> {
        const data = await this.model.findOne({ _id: id });
        if (!data) return null;
        return this.mapper.toDomain(data);
    }
    async findByName(name: string): Promise<PracticeArea | null> {
        const data = await this.model.findOne({ name: name });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAll(
        payload: FindAllPracticeAreaInputDto
    ): Promise<FindAllPracticeAreaOutputDto> {
        const skip = (payload.page - 1) * payload.limit;
        const query: Record<string, any> = {};
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
    async update(
        id: string,
        name: string,
        specId: string
    ): Promise<PracticeArea | null> {
        const updated = await this.model.findOneAndUpdate(
            { _id: id },
            { name, specializationId: specId },
            { new: true }
        );
        return updated ? this.mapper.toDomain(updated) : null;
    }
    async delete(id: string): Promise<PracticeArea | null> {
        const deleted = await this.model.findOneAndDelete({ _id: id });
        return deleted ? this.mapper.toDomain(deleted) : null;
    }
    async deleteBySpec(specId: string): Promise<void> {
        await this.model.deleteMany({ specializationId: specId });
    }
    async findBySpecIds(specIds: string[]): Promise<PracticeArea[] | []> {
        const data = await this.model.find({ specializationId: { $in: specIds } });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
}
