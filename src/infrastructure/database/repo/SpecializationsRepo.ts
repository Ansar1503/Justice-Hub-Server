import { Specialization } from "@domain/entities/Specialization";
import { BaseRepository } from "./base/BaseRepo";
import {
  ISpecializationModel,
  SpecializationModel,
} from "../model/SpecializationModel";
import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";
import { IMapper } from "@infrastructure/Mapper/IMapper";

export class SpecializationRepo
  extends BaseRepository<Specialization, ISpecializationModel>
  implements ISpecializationRepo
{
  constructor(mapper: IMapper<Specialization, ISpecializationModel>) {
    super(SpecializationModel, mapper);
  }

  async findAll(payload: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{
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
      data:
        this.mapper.toDomainArray && specializations
          ? this.mapper.toDomainArray(specializations)
          : [],
      currentPage: page,
      totalCount: count,
      totalPage,
    };
  }
}
