import { Specialization } from "@domain/entities/Specialization";
import { IBaseRepository } from "./IBaseRepo";

export interface ISpecializationRepo extends IBaseRepository<Specialization> {
  findAll(payload: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{
    data: Specialization[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
}
