import { Specialization } from "@domain/entities/Specialization";
import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { BaseRepository } from "./base/BaseRepo";
import { ISpecializationModel, SpecializationModel } from "../model/SpecializationModel";

export class SpecializationRepo
    extends BaseRepository<Specialization, ISpecializationModel>
    implements ISpecializationRepo
{
    constructor(mapper: IMapper<Specialization, ISpecializationModel>) {
        super(SpecializationModel, mapper);
    }

    async findAll(payload: { page: number; limit: number; search: string }): Promise<{
        data: Specialization[] | [];
        totalCount: number;
        currentPage: number;
        totalPage: number;
    }> {
        const { limit, page, search } = payload;
        const skip = (page - 1) * limit;

        const query: Record<string, any> = {};
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
    async findById(id: string): Promise<Specialization | null> {
        const data = await this.model.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async updateName(id: string, name: string): Promise<Specialization> {
        const updated = await this.model.findByIdAndUpdate(
            {
                _id: id,
            },
            { name },
            { new: true },
        );

        if (!updated) {
            throw new Error("update failed");
        }
        return this.mapper.toDomain(updated);
    }

    async findByName(name: string): Promise<Specialization | null> {
        const data = await this.model.findOne({ name });
        if (!data) return null;
        return this.mapper.toDomain(data);
    }
    async delete(id: string): Promise<Specialization | null> {
        const deleted = await this.model.findOneAndDelete({ _id: id });
        if (!deleted) return null;
        return this.mapper.toDomain(deleted);
    }
}
